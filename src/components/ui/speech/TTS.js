"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import GraphicEqSharpIcon from "@mui/icons-material/GraphicEqSharp";

export default function TSS({className, assistantResponse }) {
  const [loading, setLoading] = useState(false);
  const lastPlayedRef = useRef("");
  const debounceTimeout = useRef(null);

  const generarAudio = async (text) => {
    if (!text || text === lastPlayedRef.current) return;

    setLoading(true);
    try {
      const res = await fetch("/api/speech", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
      console.log(`Audio generado y reproducido: ${url}`);
      lastPlayedRef.current = text;
    } catch (error) {
      console.error("Error generando el audio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!assistantResponse || assistantResponse === lastPlayedRef.current) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      generarAudio(assistantResponse);
    }, 300); // espera 300ms antes de ejecutar (ajustable)
    
    return () => clearTimeout(debounceTimeout.current);
  }, [assistantResponse]);

  return (
    <div className="p-4 flex justify-center">
      <button
        onClick={() => generarAudio(assistantResponse)}
        disabled={loading || !assistantResponse}
      >
        {loading ? "Generando..." : <Button variant="ghost"><GraphicEqSharpIcon /></Button>}
      </button>
    </div>
  );
}
