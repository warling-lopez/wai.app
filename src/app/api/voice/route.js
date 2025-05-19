import OpenAI from "openai";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!audioFile) {
      return new Response(JSON.stringify({ error: "No audio provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Instancia de OpenAI SDK
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Transcripción con el SDK directamente
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile, // audioFile debe ser tipo Blob o File, como lo es en Next.js
      model: "whisper-1",
    });

    return new Response(JSON.stringify({ text: transcription.text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error en /api/voice:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
