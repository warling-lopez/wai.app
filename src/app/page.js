"use client";
import React, { useState } from "react";
import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";

function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hola, ¿cómo estás?" },
    { role: "user", content: "Bien, ¿y tú?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
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

      // Mostrar palabra por palabra
      let index = 0;
      let words = fullText.split(" ");
      let generated = "";

      const interval = setInterval(() => {
        if (index < words.length) {
          generated += (index === 0 ? "" : " ") + words[index];
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              // Actualizar último mensaje assistant
              return [
                ...prev.slice(0, -1),
                { role: "assistant", content: `${generated}` },
              ];
            } else {
              return [...prev, { role: "assistant", content: `${generated}` }];
            }
          });
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }); // tiempo entre cada palabra
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error al contactar la API." },
      ]);
      setIsTyping(false);
    }
  }

  return (
    <div className="grid h-[100vh] w-full col-span-3 ">
      <div className="flex flex-col w-[80%] md:w-[40%] items-center p-4 overflow-y-auto">
        <div className="w-full">
          {messages.map((msg, idx) => (
            <Msg key={idx} role={msg.role} content={msg.content} />
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center p-4">
        <InputReq onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default Home;
