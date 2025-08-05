"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import TTS from "@/components/ui/speech/TTS";
import STT from "@/components/ui/speech/STT";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";

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

  const handleSendClick = async (userInput = input) => {
    if (!userInput.trim()) return;
    setIsLoading(true);
    setInput("");
    inputRef.current && (inputRef.current.style.height = "60px");

    await onSend(userInput);
    setIsLoading(false);
  };

  return (
    <div className="rounded-4xl h-min px-1 border shadow-[0px_-20px_25px_[var(--inputReq-shadow)]] top-0 w-full md:w-[70vw] xl:w-[40vw] ">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
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
          "bg-background dark:bg-transparent text-foreground", // Colores
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground", // Placeholder y selección
          "text-base md:text-xl outline-none", // Tipografía y foco
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" // Estados deshabilitado",
        )}
        rows={1}
        disabled={isLoading}
        {...props}
      />
      {/*integraciones con la iA*/}
      <div className="flex justify-end py-2 space-x-2">
        <TTS assistantResponse={resModelo} className="hidden" />
        {/* STT envía directamente la transcripción a onSend */}
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
