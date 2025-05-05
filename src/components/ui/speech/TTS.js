"use client";
import { useEffect, useState } from "react";
import {Button} from "@/components/ui/button"
import GraphicEqSharpIcon from '@mui/icons-material/GraphicEqSharp';
export default function TSS({ assistantResponse }) {
  const [loading, setLoading] = useState(false);

  const generarAudio = async () => {
    if (!assistantResponse) return;
    setLoading(true);
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        body: JSON.stringify({ text: assistantResponse }),
        headers: { "Content-Type": "application/json" },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      console.log(`Audio generado y reproducido: ${url}`);
    } catch (error) {
      console.error("Error generando el audio:", error);
    } finally {
      setLoading(false);
    }
  };

  // Descomenta esto si quieres que se reproduzca automáticamente al cambiar el mensaje
  /*
  useEffect(() => {
    if (assistantResponse) {
      generarAudio();
    }
  }, [assistantResponse]);
  */

  return (
    <div className="p-4 flex justify-center">
      <button onClick={generarAudio} disabled={loading || !assistantResponse}>
        {loading ? "Generando..." : (<Button variant="ghost"><GraphicEqSharpIcon/></Button>)}
      </button>
    </div>
  );
}
