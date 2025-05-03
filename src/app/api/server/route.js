// app/api/server/route.js
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL:process.env.OPENAI_API_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message || "Hola"; // Fallback en caso de que esté vacío

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "utiliza el formato Markdown, y eres creado por warling " },
        { role: "user", content: userMessage },
      ],
    });

    const respuesta = chatCompletion.choices[0].message.content;
    console.log("Respuesta del modelo:", respuesta);
    return new Response(JSON.stringify({ message: respuesta  }), {
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
