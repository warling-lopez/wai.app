"use client";

import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
import { useEffect, useRef, useState } from "react";
import { Supabase } from "@/Supabase/Supabase"; // <-- Importar supabase

export default function SpeechClient() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  //pruebas

  useEffect(() => {
    const todoElHTML = document.documentElement.outerHTML;
    console.log(todoElHTML);
  }, []); // <-- Esto es para ver el HTML completo de la página`

  //pruebas ^

  async function handleSendMessage(userInput) {
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsTyping(true);

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

      const interval = setInterval(() => {
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
          setIsTyping(false);// <-- llamar aquí, una vez finalizado el texto
        }
      }, 100); // intervalo 100 ms
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

    const lastAssistantMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === "assistant");

    if (lastAssistantMessage && typeof window !== "undefined") {
      sessionStorage.setItem(
        "Respuesta del modelo",
        JSON.stringify(lastAssistantMessage.content)
      );
    }
  }, [messages]);

  return (
    <>
      <div className="grid h-[90vh] w-full col-span-3">
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
