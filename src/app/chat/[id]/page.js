"use client";

import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Supabase } from "@/Supabase/Supabase";

export default function SpeechClientChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const bottomRef = useRef(null);
  const { id: chatId } = useParams();

  async function handleSendMessage(userInput) {
    setErrorMessage(null);

    // Mostrar el mensaje del usuario en UI local inmediatamente
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsTyping(true);

    // Obtener usuario actual
    const {
      data: { user },
      error: userError,
    } = await Supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user", userError);
      setErrorMessage("Error al obtener usuario.");
      setIsTyping(false);
      return;
    }

    try {
      // Enviar al backend para que guarde y genere respuesta
      const res = await fetch("/api/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Chat_id: chatId,
          message: userInput,
          user_id: user.id,
        }),
      });

      const data = await res.json();

      if (res.status === 403 && data.error === "max_chat_limit_passed") {
        setErrorMessage(
          "Se alcanzó el límite máximo de mensajes en este chat."
        );
        setIsTyping(false);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Error desconocido");
      }

      const fullText = data.message || "";

      // Mostrar la respuesta palabra a palabra en UI local
      let index = 0;
      const words = fullText.split(" ");
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
          setIsTyping(false);
          // Ya no guardamos nada aquí porque el backend hizo la inserción
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
    async function loadMessages() {
      if (!chatId) return;

      const { data, error } = await Supabase.from("msg")
        .select("role, content")
        .eq("Chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar mensajes:", error);
      } else {
        setMessages(data);
      }
    }

    loadMessages();
  }, [chatId]);

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
    <div className="grid h-[90vh] w-full col-span-2">
      <div className="flex flex-col w-full items-center p-4 overflow-y-auto">
        <div className="w-full md:w-[70vw] xl:w-[40vw]">
          {messages.map((msg, index) => (
            <Msg key={index} role={msg.role} content={msg.content} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {errorMessage && (
        <div className="text-center text-red-600 p-2">{errorMessage}</div>
      )}

      <div className="flex justify-center items-center p-1 align-items-end">
        <InputReq onSend={handleSendMessage} />
      </div>
    </div>
  );
}
