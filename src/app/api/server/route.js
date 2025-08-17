import OpenAI from "openai";
import { Supabase } from "@/Supabase/Supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_URL,
});

const MAX_CONTEXT_LENGTH = 30;

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message || "";
    const context = body.context || [];
    // --- Paso 2: Construir el contexto para la IA ---
    // Incluye el rol de sistema, el historial recuperado y el nuevo mensaje
    const chatHistoryForAI = [
      {
        role: "system",
        content: `You are Wally, a virtual assistant created by Warhub. You provide clear, concise, and logical answers.`,
      },
      ...context,
      { role: "user", content: userMessage },
    ];

    const functions = [
      {
        name: "generate_image",
        description: "Generates an image based on a text prompt",
        parameters: {
          type: "object",
          properties: {
            prompt: { type: "string" },
            size: { type: "string", enum: ["256x256", "512x512", "1024x1024"] },
          },
          required: ["prompt"],
        },
      },
    ];

    const stream = new ReadableStream({
      async start(controller) {
        let fullMessage = { content: "", function_call: null };

        // --- Paso 3: Enviar el contexto a OpenAI ---
        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: chatHistoryForAI,
          functions,
          function_call: "auto",
          stream: true,
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta;
          if (!delta) continue;

          if (delta.content) {
            fullMessage.content += delta.content;
            controller.enqueue(new TextEncoder().encode(delta.content));
          }

          if (delta.function_call) {
            fullMessage.function_call = fullMessage.function_call || {
              name: "",
              arguments: "",
            };
            if (delta.function_call.name)
              fullMessage.function_call.name = delta.function_call.name;
            if (delta.function_call.arguments)
              fullMessage.function_call.arguments +=
                delta.function_call.arguments;
          }
        }

        // --- Paso 4: Guardar la respuesta de la IA en Supabase ---
        await Supabase.from("msg").insert([
          { role: "assistant", content: fullMessage.content, user_id: user, Chat_id: chatId }
        ]);

        // Si el modelo decide generar imagen...
        if (fullMessage.function_call?.name === "generate_image") {
          const args = JSON.parse(fullMessage.function_call.arguments);
          const validSizes = ["1024x1024"];
          let imageSize = validSizes.includes(args.size) ? args.size : "1024x1024";

          const imageResp = await openai.images.generate({
            model: "dall-e-2",
            prompt: args.prompt,
            size: imageSize,
            n: 1,
          });

          const imageUrl = imageResp.data[0].url;
          // Guardar la URL de la imagen en la base de datos
          await Supabase.from("msg").insert([
            { role: "assistant", content: `![Image](${imageUrl})`, user_id: user, Chat_id: chatId }
          ]);
          controller.enqueue(
            new TextEncoder().encode(`\n![Image](${imageUrl})`)
          );
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error interno:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}