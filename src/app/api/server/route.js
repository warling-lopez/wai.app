// app/api/server/route.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const userMessage = body.message || "Hola"; // Fallback en caso de que esté vacío

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: "Responde usando HTML. Usa encabezados, listas con puntos, etc. y si quieres dar estilos usa taildwincss" },
        { role: "user", content: userMessage },
      ],
    });

    const respuesta = chatCompletion.choices[0].message.content;
    const formattedResponse = respuesta.replace(/\n/g, "\n\n");
    console.log("Respuesta del modelo:", respuesta);
    return new Response(JSON.stringify({ message: formattedResponse }), {
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
