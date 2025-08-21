"use client";

import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Supabase } from "@/Supabase/Supabase";
import Image from "next/image";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";
import WallyAlert from '@/components/ui/limited';

export default function SpeechClient() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const [files, setFiles] = useState("");
  const { id: chatId } = useParams();
  const router = useRouter();
  // 🔥 ESTADO PARA MANEJAR LA ALERTA
  const [alert, setAlert] = useState(null);

  // 🔥 FUNCIONES PARA MOSTRAR DIFERENTES TIPOS DE ALERTAS
  const showLimitAlert = () => {
    setAlert({
      type: 'limit',
      title: 'Límite de mensajes alcanzado',
      message: 'Has alcanzado el límite de este chat para el plan gratuito.',
      buttonText: 'Actualizar',
      onButtonClick: () => setAlert(null)
    });
  };

  const showErrorAlert = () => {
    setAlert({
      type: 'error',
      title: 'Error de conexión',
      message: 'No se pudo conectar con Wally. Intenta de nuevo.',
      buttonText: 'Reintentar',
      onButtonClick: () => {
        setAlert(null);
        router.push('/log/signup');
        // Aquí podrías reintentar la última acción
      }
    });
  };

  const showNetworkAlert = () => {
    setAlert({
      type: 'error',
      title: 'Error de red',
      message: 'No se pudo conectar con el servidor. Intenta de nuevo más tarde.',
      buttonText: 'Reintentar',
      onButtonClick: () => {
        setAlert(null);
        // Aquí podrías reintentar la última acción
      }
    });
  };

  async function handleSendMessage(userInput, previews = []) {
    // 🔥 VERIFICAR LÍMITE Y MOSTRAR ALERTA
    if (messages.length >= 20) {
      showLimitAlert();
      return;
    }

    // Agregar mensaje visible del usuario
    setMessages((prev) => [...prev, { role: "user", content: userInput }]);

    const {
      data: { user },
      error: userError,
    } = await Supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error obteniendo usuario", userError);
      router.push('/log/signup'); // Redirigir al usuario si no está autenticado
      return;
    }

    // Guardar solo mensaje de usuario
    const { error: insertUserError } = await Supabase.from("msg").insert([
      { Chat_id: chatId, role: "user", content: userInput, user_id: user.id },
    ]);
    if (insertUserError) {
      console.error("Error insertando mensaje del usuario:", insertUserError);
      showErrorAlert();
      return;
    }

    // Extraer textos de archivos y guardar como bloque separado
    if (previews.length > 0) {
      const filesText = [];
      for (let fileObj of previews) {
        if (fileObj.file) {
          let text = "";
          if (fileObj.file.type === "text/plain")
            text = await fileObj.file.text();
          else if (fileObj.file.type === "application/pdf") {
            const arrayBuffer = await fileObj.file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer })
              .promise;
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const content = await page.getTextContent();
              text += content.items.map((item) => item.str).join(" ") + "\n";
            }
          } else if (
            fileObj.file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileObj.file.type === "application/msword"
          ) {
            const arrayBuffer = await fileObj.file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;
          }
          if (text) filesText.push(`---${fileObj.name}---\n${text}`);
        }
      }

      if (filesText.length) {
        const combinedFilesText = filesText.join("\n");
        setFiles(combinedFilesText);
      }
    }

    // Enviar mensaje al backend para generar respuesta
    setIsTyping(true);
    try {
      const res = await fetch("/api/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context: messages,
          message: userInput,
          user: user.id,
          chatId: chatId,
          files: files,
        }),
      });

      if (!res.body) throw new Error("No hay stream de respuesta");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let generated = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        generated += decoder.decode(value, { stream: true });
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

      const { error: insertBotError } = await Supabase.from("msg").insert([
        {
          Chat_id: chatId,
          role: "assistant",
          content: generated,
          user_id: user.id,
        },
      ]);
      if (insertBotError) {
        console.error("Error insertando respuesta del asistente:", insertBotError);
        showErrorAlert();
      }
    } catch (err) {
      console.error("Error al obtener respuesta:", err);
      setIsTyping(false);
      
      // 🔥 MOSTRAR ALERTA DE ERROR EN LUGAR DE alert()
      if (err.message.includes('network') || err.message.includes('fetch')) {
        showNetworkAlert();
      } else {
        showErrorAlert();
      }
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
        router.push('/log/signup'); // Redirigir al usuario si no está autenticado
        showErrorAlert();
        return;
      }

      const { data, error } = await Supabase.from("msg")
        .select("role, content")
        .eq("Chat_id", chatId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error al cargar mensajes:", error);
        showErrorAlert();
      } else {
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
    <div className="grid h-full w-full col-span-2 relative">
      
      {/* 🔥 MOSTRAR ALERTA SI EXISTE */}
      {alert && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <WallyAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            buttonText={alert.buttonText}
            onButtonClick={alert.onButtonClick}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <div className="flex flex-col w-full items-center p-4 overflow-y-auto">
        <div className="w-full md:w-[70vw] xl:w-[40vw]">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.role === "user_file" ? null : msg.content.startsWith(
                  "http"
                ) ? (
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
      
      <div className="flex sticky bottom-5 bg-background justify-center items-center p-1">
        <InputReq onSend={handleSendMessage} />
      </div>
    </div>
  );
}

// 🔥 VERSIÓN ALTERNATIVA CON HOOK PERSONALIZADO (MÁS LIMPIA)
/*
import WallyAlert, { useWallyAlert } from '@/components/ui/limited';

export default function SpeechClient() {
  // ... otros estados
  const { alert, showLimitAlert, showErrorAlert, hideAlert } = useWallyAlert();

  async function handleSendMessage(userInput, previews = []) {
    if (messages.length >= 100) {
      showLimitAlert('Has alcanzado el límite de 100 mensajes en este chat.');
      return;
    }
    
    try {
      // ... lógica existente
    } catch (err) {
      showErrorAlert('No se pudo conectar con Wally. Intenta de nuevo.');
    }
  }

  return (
    <div className="grid h-full w-full col-span-2 relative">
      {alert && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <WallyAlert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={hideAlert}
          />
        </div>
      )}
      // ... resto del JSX
    </div>
  );
}
*/