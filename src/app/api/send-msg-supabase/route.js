// app/api/send-message/route.js
import { Supabase } from "@/Supabase/Supabase";

export async function POST(request) {
  const body = await request.json();
  const { Chat_id, role, content, user_id } = body;

  if (!Chat_id || !role || !content || user_id) {
    return new Response(JSON.stringify({ error: "Missing data" }), { status: 400 });
  }

  const { data, error } = await Supabase
    .from("msg")
    .insert([{ Chat_id, role, content, user_id }]);

  if (error) {
    return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, data }), { status: 200 });
}
