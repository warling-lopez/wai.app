import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_CONTEXT_LENGTH = 30;
let chatContext = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message || "Hola";

    chatContext.push({ role: "user", content: userMessage });
    if (chatContext.length > MAX_CONTEXT_LENGTH) {
      chatContext.shift();
    }

    const stream = new ReadableStream({
      async start(controller) {
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

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            controller.enqueue(new TextEncoder().encode(content));
          }
        }

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
