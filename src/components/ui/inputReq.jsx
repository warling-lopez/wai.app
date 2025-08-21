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
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import mammoth from "mammoth";

function InputReq({ className, type = "text", onSend, ...props }) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resModelo, setResModelo] = useState("");
  const [previews, setPreviews] = useState([]); // Array de archivos
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
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

  // Extraer texto de archivos
  const extractTextFromFile = async (file) => {
    if (file.type === "text/plain") {
      return await file.text();
    } else if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        fullText += pageText + "\n";
      }
      return fullText;
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      return ""; // Otros tipos no soportados
    }
  };

  const handleSendClick = async (userInput = input) => {
    if (!chatId) {
      handleNewChat();
      return;
    }
    if (!userInput.trim() && previews.length === 0) return;

    setIsLoading(true);
    setInput("");
    inputRef.current && (inputRef.current.style.height = "60px");

    // Extraer texto de archivos
    const filesText = [];
    for (let fileObj of previews) {
      if (fileObj.file) {
        const text = await extractTextFromFile(fileObj.file);
        if (text) filesText.push({ name: fileObj.name, text });
      }
    }

    // 1️⃣ Enviar solo el mensaje del usuario para mostrar en la UI
    await onSend(userInput, []);

    // 2️⃣ Enviar los textos de los archivos como un bloque aparte
    if (filesText.length) {
      const combinedFilesText = filesText
        .map(f => `---${f.name}---\n${f.text}`)
        .join("\n");
      await onSend(combinedFilesText, previews);
    }

    setIsLoading(false);
    setPreviews([]); // Limpiar archivos después de enviar
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (previews.length + files.length > 3) {
      alert("Solo puedes adjuntar máximo 3 archivos.");
      return;
    }

    const newPreviews = files.map((file) => {
      if (file.type.startsWith("image/")) {
        return { type: "image", url: URL.createObjectURL(file), name: file.name, file };
      } else {
        return { type: "file", name: file.name, file };
      }
    });
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removePreview = (index) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "rounded-4xl md:rounded-3xl h-min px-1 border shadow-[0px_5px_20px_#000] top-0 w-full m-0 md:w-[70vw] xl:w-[40vw]",
        className
      )}
    >
      {/* Previsualización de archivos */}
      {previews.length > 0 && (
        <div className="px-2 py-3 flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {preview.type === "image" ? (
                <img
                  src={preview.url}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border"
                />
              ) : (
                <div className="px-3 py-1 rounded-xl border bg-gray-100 dark:bg-neutral-800">
                  📄 {preview.name}
                </div>
              )}
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-[-5] right-[-5] bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-sm"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

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
          "min-h-[60px] max-h-[200px] resize-none overflow-hidden",
          "w-full min-w-0 flex px-3 py-2 rounded-2xl border-0 border-input",
          "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          "text-base md:text-xl outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        )}
        rows={1}
        disabled={isLoading}
        {...props}
      />

      {/* Botones e integraciones */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center ml-1 mb-2 space-x-2">
          <Button type="button" variant="tool_outline" onClick={handleAttachClick}>
            <MdOutlineAttachFile className="w-7 h-7" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />

          <ToolSelector />
        </div>

        <div className="flex place-content-center space-x-4">
          <STT onTranscribe={handleSendClick} />
          <div>
            <Button
              onClick={() => handleSendClick()}
              variant="ghost"
              disabled={isLoading}
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
