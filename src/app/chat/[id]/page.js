"use client";

import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
import { useEffect, useRef, useState } from "react";

export default function SpeechClientChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  async function handleSendMessage(userInput) {
    // Agregar mensaje del usuario al estado local
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsTyping(true);

    // 📝 Guardar mensaje del usuario en Supabase
    await fetch("/api/send-msg-supabase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Chat_id: "default", // <-- reemplaza con ID real si lo tienes
        role: "user",
        content: userInput,
      }),
    });

    try {
      const res = await fetch("/api/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await res.json();
      const fullText = data.message || "";

      let index = 0;
      let words = fullText.split(" ");
      let generated = "";

      const interval = setInterval(async () => {
        if (index < words.length) {
          generated += (index === 0 ? "" : " ") + words[index];
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return [
                ...prev.slice(0, -1),
                { role: "assistant", content: generated },
              ];
            } else {
              return [...prev, { role: "assistant", content: generated }];
            }
          });
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);

          // ✅ Guardar respuesta del asistente al terminar de escribir
          await fetch("/api/send-msg-supabase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              Chat_id: "default", // <-- igual que arriba
              role: "assistant",
              content: fullText,
            }),
          });
        }
      }, 100);
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de conexión." },
      ]);
      setIsTyping(false);
    }
  }

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && !isTyping)
    ) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

      if (lastMessage?.role === "assistant" && typeof window !== "undefined") {
        sessionStorage.setItem(
          "Respuesta del modelo",
          JSON.stringify(lastMessage.content)
        );
      }
    }
  }, [messages, isTyping]);

  return (
    <>
      <div className="grid h-[90vh] w-full col-span-2">
        <div className="flex flex-col w-full items-center p-4 overflow-y-auto">
          <div className="w-full md:w-[70vw] xl:w-[40vw]">
            {messages.map((msg, index) => (
              <Msg key={index} role={msg.role} content={msg.content} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="flex justify-center items-center p-1 ">
          <InputReq onSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
}
