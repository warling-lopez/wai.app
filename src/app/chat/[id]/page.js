"use client";

import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Supabase } from "@/Supabase/Supabase";
import Image from "next/image";

export default function SpeechClient() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const { id: chatId } = useParams();

  async function handleSendMessage(userInput) {
    // Validar chatId
    if (!chatId) {
      console.error("No hay un chat, no se puede guardar el mensaje");
      return;
    }

    // Agregar mensaje del usuario localmente
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setIsTyping(true);

    // Obtener usuario
    const {
      data: { user },
      error: userError,
    } = await Supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error obteniendo usuario", userError);
      return;
    }

    // Insertar mensaje del usuario en Supabase
    const { error: insertUserError } = await Supabase.from("msg").insert([
      {
        Chat_id: chatId,
        role: "user",
        content: userInput,
        user_id: user.id,
      },
    ]);

    if (insertUserError) {
      console.error("Error insertando mensaje del usuario:", insertUserError);
    }

    try {
    
      const res = await fetch("/api/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({context: messages, message: userInput }),
      });

      if (!res.body) throw new Error("No hay stream de respuesta");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let generated = "";

      // Crear mensaje vacío para el asistente
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        generated += chunk;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { role: "assistant", content: generated },
            ];
          }
          return [...prev, { role: "assistant", content: generated }];
        });
      }

      setIsTyping(false);

      // Guardar respuesta completa en Supabase
      const { error: insertBotError } = await Supabase.from("msg").insert([
        {
          Chat_id: chatId,
          role: "assistant",
          content: generated,
          user_id: user.id,
        },
      ]);

      if (insertBotError) {
        console.error(
          "Error insertando respuesta del asistente:",
          insertBotError
        );
      }
    } catch (error) {
      console.error("Error al obtener respuesta:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error de conexión." },
      ]);
      setIsTyping(false);
    }
  }

  // Cargar mensajes existentes
  useEffect(() => {
    async function loadMessages() {
      if (!chatId) return;

      const {
        data: { user },
        error: userError,
      } = await Supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error obteniendo usuario:", userError);
        return;
      }

      const { data, error } = await Supabase.from("msg")
        .select("role, content")
        .eq("Chat_id", chatId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(10); // Limitar a los últimos 100 mensajes

      if (error) {
        console.error("Error al cargar mensajes:", error);
      } else {
        console.log("Mensajes cargados:", data);
        setMessages(data);
      }
    }

    loadMessages();
  }, [chatId]);

  // Scroll automático al último mensaje
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
            <div key={index}>
              {msg.content.startsWith("http") ? (
                <div className="max-w-[256px] rounded-xl">
                  <Image src={msg.content} alt="Generated" />
                </div>
              ) : (
                <Msg role={msg.role} content={msg.content} />
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>
      </div>
      <div className="flex justify-center items-center p-1 align-items-end">
        <InputReq onSend={handleSendMessage} />
      </div>
    </div>
  );
}
