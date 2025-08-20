"use client";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import TTS from "@/components/ui/speech/TTS";
import STT from "@/components/ui/speech/STT";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopIcon from "@mui/icons-material/Stop";
import { ToolSelector } from "@/components/ui/tools/select-tools";
import { MdOutlineAttachFile } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import handleNewChat from "@/components/handle-newChat";


function InputReq({ className, type = "text", onSend, ...props }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resModelo, setResModelo] = useState("");
  const inputRef = useRef(null);
  const { id: chatId } = useParams();

  // Escuchar sessionStorage para TTS
  useEffect(() => {
    const interval = setInterval(() => {
      const nuevaRespuesta =
        sessionStorage.getItem("Respuesta del modelo") || "";
      setResModelo((prev) => (prev !== nuevaRespuesta ? nuevaRespuesta : prev));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSendClick = async (userInput = input) => {
    if (!chatId) {
      handleNewChat();
      return;
    }
    if (!userInput.trim()) return;
    setIsLoading(true);
    setInput("");
    inputRef.current && (inputRef.current.style.height = "60px");

    await onSend(userInput);
    setIsLoading(false);
  };

  return (
    <div className="rounded-4xl  md:rounded-3xl h-min px-1 border shadow-[0px_5px_20px_#000] top-0 w-full m-0 md:w-[70vw] xl:w-[40vw] ">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.maxHeight = "200px"; // límite
          e.target.style.height = "auto";
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
          "min-h-[60px] max-h-[200px] resize-none overflow-hidden", // Comportamiento
          "w-full min-w-0 flex", // Tamaño y display
          "px-3 py-2 rounded-2xl border-0 border-input", // Espaciado y bordes
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground", // Placeholder y selección
          "text-base md:text-xl outline-none", // Tipografía y foco
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" // Estados deshabilitado",
        )}
        rows={1}
        disabled={isLoading}
        {...props}
      />
      {/*integraciones con la iA*/}
      <div className="flex items-center justify-between mt-2">
        {/* STT envía directamente la transcripción a onSend */}
        <div className="flex items-center ml-1 mb-2 space-x-2">
          <Button type="button" variant="tool_outline">
            <MdOutlineAttachFile className="w-7 h-7" />
          </Button>

          <ToolSelector />
        </div>
        <div className="flex  place-content-center space-x-4">
          <STT onTranscribe={handleSendClick} />
          <div>
            <Button
              onClick={() => handleSendClick()}
              variant="ghost"
              disabled={isLoading}
              className=""
            >
              {isLoading ? (
                <StopIcon sx={{ fontSize: 40 }} className="animate-spin" />
              ) : (
                <PlayCircleIcon sx={{ fontSize: 45 }} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { InputReq };
