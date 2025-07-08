"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GraphicEqSharpIcon from "@mui/icons-material/GraphicEqSharp";

export default function TSS({ className, assistantResponse }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generarAudio = async () => {
    if (!assistantResponse) {
      console.log('No hay texto para convertir a audio');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Iniciando generación de audio...');
      
      const res = await fetch("/api/speech", {
        method: "POST",
        body: JSON.stringify({ text: assistantResponse }),
        headers: { 
          "Content-Type": "application/json",
        },
      });

      console.log('Respuesta del servidor:', res.status, res.statusText);

      if (!res.ok) {
        // Intentar leer el error del servidor
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Error del servidor: ${res.status}`);
      }

      const blob = await res.blob();
      console.log('Blob recibido:', blob.size, 'bytes');

      if (blob.size === 0) {
        throw new Error('El audio recibido está vacío');
      }

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      
      // Manejar eventos del audio
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio listo para reproducir');
      });

      audio.addEventListener('error', (e) => {
        console.error('Error en la reproducción del audio:', e);
        setError('Error al reproducir el audio');
      });

      audio.addEventListener('ended', () => {
        console.log('Reproducción terminada');
        URL.revokeObjectURL(url); // Limpiar memoria
      });

      await audio.play();
      console.log('Audio reproducido exitosamente');

    } catch (error) {
      console.error("Error generando el audio:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={generarAudio}
        className="flex justify-center align-center"
        disabled={loading || !assistantResponse}
        title={error || (loading ? "Generando audio..." : "Reproducir audio")}
      >
        {loading ? "Generando..." : <GraphicEqSharpIcon />}
      </Button>
      {error && (
        <div className="text-red-500 text-xs mt-1 max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}