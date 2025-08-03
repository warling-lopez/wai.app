"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import TTS from "@/components/ui/speech/TTS";
import STT from "@/components/ui/speech/STT";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { Supabase } from "@/Supabase/Supabase";
import OpenAI from "openai";

function InputReq({ className, type = "text", onSend, ...props }) {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [resModelo, setResModelo] = React.useState("");
  const inputRef = React.useRef(null);

  // Escuchar sessionStorage para TTS
  React.useEffect(() => {
    const interval = setInterval(() => {
      const nuevaRespuesta =
        sessionStorage.getItem("Respuesta del modelo") || "";
      setResModelo((prev) => (prev !== nuevaRespuesta ? nuevaRespuesta : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const addmsgSupabase = async (userInput) => {
    const chatId = sessionStorage.getItem("chatId");
    const userId = sessionStorage.getItem("userId");

    if (!userInput.trim() || !chatId || !userId) return;

    try {
      // 1. Guardar mensaje del usuario
      await Supabase.from("msg").insert({
        chat_id: chatId,
        sender_id: userId,
        role: "user",
        content: userInput,
      });

      // 2. Obtener historial
      const { data: messages } = await Supabase.from("msg")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      const prompt = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 3. Enviar a OpenAI
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: false,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4", // o gpt-3.5-turbo
        messages: prompt,
      });

      const assistantResponse = completion.choices[0].message.content;

      // 4. Guardar respuesta del modelo
      await Supabase.from("msg").insert({
        chat_id: chatId,
        sender_id: "gpt",
        role: "assistant",
        content: assistantResponse,
      });

      sessionStorage.setItem("Respuesta del modelo", assistantResponse);
    } catch (error) {
      console.error("Error en addmsgSupabase:", error);
    }
  };

  const handleSendClick = async (userInput = input) => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setInput("");
    inputRef.current && (inputRef.current.style.height = "60px");

    await onSend?.(userInput); // si quieres actualizar algún estado visual
    await addmsgSupabase(userInput); // lógica de mensaje y respuesta
    setIsLoading(false);
  };

  return (
    <div className="rounded-4xl pr-1 pl-1 border shadow-[0px_-20px_25px_[var(--inputReq-shadow)]] top-0 w-full md:w-[70vw] xl:w-[40vw] ">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = e.target.scrollHeight + "px";
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
          }
        }}
        placeholder="Pregúntale a WALLY"
        className={cn(
          "max-h-[200px] rounded-2xl *: resize-none overflow-hidden placeholder:text-muted-foreground selection:bg-primary text-foreground selection:text-primary-foreground bg-background border-input flex w-full min-w-0 border-0 dark:bg-transparent px-3 py-2 text-base outline-none h-[60px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl",
          className
        )}
        rows={1}
        disabled={isLoading}
        {...props}
      />
      {/*integraciones con la iA*/}
      <div className="flex justify-end py-2 space-x-2">
        <TTS assistantResponse={resModelo} className="hidden" />
        {/* STT envía directamente la transcripción a handleSendClick */}
        <STT onTranscribe={handleSendClick} />
        <div>
          <Button
            onClick={() => handleSendClick()}
            variant="ghost"
            disabled={isLoading}
          >
            {isLoading ? (
              <StopIcon className="animate-spin" />
            ) : (
              <PlayArrowIcon />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { InputReq };
