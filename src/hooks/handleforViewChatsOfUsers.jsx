import { useEffect, useState } from "react";
import { Supabase } from "@/Supabase/Supabase";

export default function ChatsList() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      const {
        data: { user },
        error: userError,
      } = await Supabase.auth.getUser();

      if (user) {
        const { data, error } = await Supabase
          .from("Chats")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error al obtener los chats:", error);
        } else {
          setChats(data);
        }
      }
    }

    fetchChats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-ms font-bold mb-4">Mis chats</h2>
      <ul className="space-y-2">
        {chats.length === 0 ? (
          <li className="text-gray-500">No tienes chats aún.</li>
        ) : (
          chats.map((chat) => (
            <li
              key={chat.id}
              className="p-3 bg-background rounded hover:bg-primary text-foreground cursor-pointer"
              onClick={() => window.location.href = `/chat/${chat.id}`}
            >
              {chat.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
