import OpenAI from "openai";

// Instancia de OpenAI
const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

// Establecer el tamaño máximo de contexto que deseas mantener
const MAX_CONTEXT_LENGTH = 30;

// Variable para almacenar el contexto (esto se pierde cada vez que reinicias el servidor)
let chatContext = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message || "Hola"; // Fallback

    // Agregar el nuevo mensaje al contexto
    chatContext.push({ role: "user", content: userMessage });

    // Mantener solo los últimos MAX_CONTEXT_LENGTH mensajes
    if (chatContext.length > MAX_CONTEXT_LENGTH) {
      chatContext.shift();
    }

    // Crear un ReadableStream para enviar datos en tiempo real
    const stream = new ReadableStream({
      async start(controller) {
        // Llamar a la API en modo streaming
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini-2024-07-18",
          messages: [
            {
              role: "system",
              content: `You are Wally, a virtual assistant created by Warhub. You provide clear, concise, and logical answers to help users solve their problems. You respond step-by-step, avoid overexplaining, and adjust your level of detail depending on the user's questions.`,
            },
            ...chatContext,
          ],
          stream: true,
        });

        let fullResponse = "";

        // Recorrer cada fragmento que envía el modelo
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            controller.enqueue(new TextEncoder().encode(content)); // Enviar fragmento al cliente
          }
        }

        // Guardar la respuesta completa en el contexto
        chatContext.push({ role: "assistant", content: fullResponse });

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
    console.error("Error al llamar a OpenAI:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}
