"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import TTS from "@/components/ui/speech/TTS";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

function InputReq({ className, type = "text", onSend, ...props }) {
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [resModelo, setResModelo] = React.useState("");
  const inputRef = React.useRef(null);

  // 🧠 Escuchar cambios en sessionStorage cada 500ms
  React.useEffect(() => {
    const interval = setInterval(() => {
      const nuevaRespuesta = sessionStorage.getItem("Respuesta del modelo") || "";
      setResModelo((prev) => {
        return prev !== nuevaRespuesta ? nuevaRespuesta : prev;
      });
    }, 500); // Ajusta el intervalo si lo necesitas

    return () => clearInterval(interval); // limpieza
  }, []);
  
  const handleSendClick = async () => {
    if (input.trim() === "") return;

    setIsLoading(true);
    try {
      await onSend(input);
      setInput("");

      const el = inputRef.current;
      if (el) {
        el.style.height = "60px";
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-4xl pr-1 pl-1 border shadow-xl top-0 w-full md:w-[70vw] xl:w-[40vw] mb-16">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = "60px";
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
          "max-h-[200px] resize-none overflow-hidden placeholder:text-muted-foreground selection:bg-primary text-gray-700 selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 border-0 bg-transparent px-3 py-2 text-base outline-none h-[60px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl",
          className
        )}
        rows={1}
        disabled={isLoading}
        {...props}
      />
      <div className="flex justify-end">
        <TTS assistantResponse={resModelo} />
        <Button
          onClick={handleSendClick}
          variant="circle"
          disabled={isLoading}
          className="relative right-1 bottom-2"
        >
          {isLoading ? (
            <StopIcon className="animate-spin cursor-not-allowed" />
          ) : (
            <PlayArrowIcon />
          )}
        </Button>
      </div>
    </div>
  );
}

export { InputReq };
