"use client";
import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
import { useEffect, useRef, useState } from "react";
import TTS from "@/components/ui/speech/TTS"
export default function SpeechClient() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "" },
    { role: "user", content: "welcome user" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
              return [...prev.slice(0, -1), { role: "assistant", content: generated }];
            } else {
              return [...prev, { role: "assistant", content: generated }];
            }
          });
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      });
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error al contactar la API." },
      ]);
      setIsTyping(false);
    }
  }

  const lastAssistantMessage = messages.findLast((m) => m.role === "assistant");

  return (
    <>
      <div className="grid h-[100vh] w-full col-span-3">
        <div className="flex flex-col w-full items-center p-4 overflow-y-auto">
          <div className="w-full md:w-[70vw] xl:w-[40vw]">
            {messages.map((msg, idx) => (
              <Msg key={idx} role={msg.role} content={msg.content} />
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
        <div className="flex justify-center items-center p-4">
          <InputReq onSend={handleSendMessage} />
        </div>
      </div>
    </>
  );
}
