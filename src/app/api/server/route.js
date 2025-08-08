import OpenAI from "openai";
import { Supabase } from "@/Supabase/Supabase";


const openai = new OpenAI({
  baseURL: process.env.OPENAI_API_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

// Máximo de mensajes permitidos en el chat
const MAX_CONTEXT_LENGTH = 40;

export async function POST(request) {
  try {
    const body = await request.json();
    const { chat_id, message, user_id } = body; // user_id viene por autenticación

    if (!chat_id || !message) {
      return new Response(
        JSON.stringify({ error: "chat_id y message son requeridos" }),
        { status: 400 }
      );
    }

    // 1. Contar mensajes existentes en este chat
    const { data: countData, error: countError } = await Supabase
      .from("msg")
      .select("id", { count: "exact" })
      .eq("chat_id", chat_id);

    if (countError) throw countError;

    const totalmsg = countData.length;

    // 2. Si supera el límite, devolver error
    if (totalmsg >= MAX_CONTEXT_LENGTH) {
      return new Response(
        JSON.stringify({ error: "max_chat_limit_passed" }),
        { status: 403 }
      );
    }

    // 3. Obtener historial del chat ordenado
    const { data: history, error: fetchError } = await Supabase
      .from("msg")
      .select("role, content")
      .eq("chat_id", chat_id)
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;

    // 4. Agregar el nuevo mensaje del usuario al contexto
    const chatContext = [...history, { role: "user", content: message }];

    // 5. Llamar a OpenAI con el historial
    const chatCompletion = await openai.chat.completions.create({
      model: "o3-mini-2025-01-31",
      messages: [
        {
          role: "system",
          content: `You are Wally, a virtual assistant created by WarHub. You provide clear, concise, and logical answers to help users solve their problems. You respond step-by-step, avoid overexplaining, and adjust your level of detail depending on the user's questions.`,
        },
        ...chatContext,
      ],
    });

    const respuesta = chatCompletion.choices[0].message.content;

    // 6. Guardar el mensaje del usuario
    await Supabase.from("msg").insert([
      { chat_id, user_id, role: "user", content: message },
    ]);

    // 7. Guardar la respuesta del asistente
    await Supabase.from("msg").insert([
      { chat_id, user_id, role: "assistant", content: respuesta },
    ]);

    // 8. Enviar la respuesta al cliente
    return new Response(JSON.stringify({ message: respuesta }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error al procesar el chat:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
    });
  }
}
