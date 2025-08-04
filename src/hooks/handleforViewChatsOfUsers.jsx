import { useEffect, useState } from "react";
import { Supabase } from "@/Supabase/Supabase";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function ChatsList() {
  const [groupedChats, setGroupedChats] = useState({});
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
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error al obtener los chats:", error);
        } else {
          const grouped = groupChatsByDate(data);
          setGroupedChats(grouped);
        }
      }
    }

    fetchChats();
  }, []);

  function groupChatsByDate(chats) {
    const groups = {
      Hoy: [],
      Ayer: [],
      "Días anteriores": [],
    };

    const today = dayjs();
    const yesterday = today.subtract(1, "day");

    chats.forEach((chat) => {
      const chatDate = dayjs(chat.created_at);
      if (chatDate.isSame(today, "day")) {
        groups.Hoy.push(chat);
      } else if (chatDate.isSame(yesterday, "day")) {
        groups.Ayer.push(chat);
      } else {
        groups["Días anteriores"].push(chat);
      }
    });

    return groups;
  }

  return (
    <div className="p-2">
      <h2 className="text-sm text-accent mb-4">chats</h2>
      {Object.entries(groupedChats).map(([section, chats]) =>
        chats.length > 0 ? (
          <div key={section} className="mb-4">
            <h3 className="text-xs text-muted-foreground mb-1">{section}</h3>
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className="p-2 text-md rounded-md hover:bg-background text-foreground cursor-pointer"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  {chat.title}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </div>
  );
}
