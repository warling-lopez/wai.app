"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

export default function STT({ className, onTranscribe }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);

      recorder.onstop = async () => {
        setLoading(true);
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob, "grabacion.webm");

        try {
          const res = await fetch("/api/voice", {
            method: "POST",
            body: formData,
          });
          const { text } = await res.json();

          if (text) {
            // 1) Llamamos al callback para que lo trate como mensaje de usuario
            onTranscribe?.(text);

            // 2) Guardamos la transcripción en sessionStorage
            if (typeof window !== "undefined") {
              sessionStorage.setItem("userTranscription", text);
            }
          }
        } catch (err) {
          console.error("Error transcribiendo:", err);
        } finally {
          setLoading(false);
          setRecording(false);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error al iniciar micrófono:", err);
      setRecording(false);
    }
  };

  const detenerGrabacion = () => {
    mediaRecorderRef.current?.stop();
  };

  const manejarClick = () => {
    if (recording) detenerGrabacion();
    else iniciarGrabacion();
  };

  return (
    <Button
      variant="tool_outline"
      onClick={manejarClick}
      className={className || "relative left-0"}
      
      disabled={loading}
    >
      {loading
        ? "Transcribiendo..."
        : recording
        ? <StopIcon />
        : <MicIcon sx={{ fontSize: 20 }} />}
    </Button>
  );
}
