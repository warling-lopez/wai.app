import { useEffect, useState } from "react";
import { Supabase } from "@/Supabase/Supabase";
import { useRouter } from "next/navigation";

export default function ChatsList() {
  const [chats, setChats] = useState([]);
  const router = useRouter();

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
    <div >
      <h2 className="text-sm text-accent mb-4">Mis chats</h2>
      <ul className="space-y-2">
        {chats.length === 0 ? (
          <li className="text-gray-500">No tienes chats aún.</li>
        ) : (
          chats.map((chat) => (
            <li
              key={chat.id}
              className="p-b-2 text-md rounded-xl hover:bg-background text-foreground cursor-pointer"
              onClick={() => router.push(`/chat/${chat.id}`)}
            >
              {chat.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
