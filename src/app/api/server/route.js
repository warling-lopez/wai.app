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
    const userMessage = body.message || "Hola"; // Fallback en caso de que esté vacío

    // Agregar el nuevo mensaje al contexto
    chatContext.push({ role: "user", content: userMessage });

    // Mantener solo los últimos MAX_CONTEXT_LENGTH mensajes en el contexto
    if (chatContext.length > MAX_CONTEXT_LENGTH) {
      chatContext.shift(); // Eliminar el primer mensaje (el más antiguo)
    }

    // Llamar a la API de OpenAI con el contexto actualizado
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        {
          role: "system",
          content: `You are Wally, a virtual assistant created by Warhub. You provide clear, concise, and logical answers to help users solve their problems. You respond step-by-step, avoid overexplaining, and adjust your level of detail depending on the user's questions.`,
        },
        ...chatContext, // Incluir los mensajes del contexto
      ],
    });

    // Obtener la respuesta del modelo
    const respuesta = chatCompletion.choices[0].message.content;

    // Agregar la respuesta del asistente al contexto
    chatContext.push({ role: "assistant", content: respuesta });

    console.log("Respuesta del modelo:", respuesta);

    // Enviar la respuesta al cliente
    return new Response(JSON.stringify({ message: respuesta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al llamar a OpenAI:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}
