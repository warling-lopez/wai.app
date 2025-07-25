import { experimental_generateSpeech as generateSpeech } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { writeFile, unlink, access } from "fs/promises";
import path from "path";

export async function POST(req) {
  console.log("=== INICIO DE PETICIÓN ===");

  try {
    // Verificar que la API key existe
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key no está configurada");
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 }
      );
    }

    console.log(
      "API key encontrada, longitud:",
      process.env.OPENAI_API_KEY.length
    );

    const body = await req.json();
    const text = body.text || "Hola, esta es una prueba de voz.";

    console.log("Texto recibido:", text.substring(0, 100) + "...");
    console.log("Longitud del texto:", text.length);

    console.log("Iniciando generación de audio...");

    const { audio } = await generateSpeech({
      model: openai.speech("gpt-4o-mini-tts", {
        apiKey: process.env.OPENAI_API_KEY,
      }),
      text,
      voice: "nova",
      outputFormat: "mp3",
    });

    console.log(
      "Audio generado exitosamente, tamaño:",
      audio.uint8Array.length
    );

    // Definir la ruta del archivo
    const speechDir = path.join(process.cwd(), "api", "speech");
    const audioFilePath = path.join(speechDir, "nuevo_audio.mp3");

    console.log("Ruta de guardado:", audioFilePath);

    // Crear directorio si no existe
    try {
      await access(speechDir);
      console.log("Directorio existe");
    } catch (error) {
      console.log("Creando directorio:", speechDir);
      const fs = require("fs");
      await fs.promises.mkdir(speechDir, { recursive: true });
    }

    // Verificar si el archivo existe y eliminarlo si es así
    try {
      await access(audioFilePath);
      await unlink(audioFilePath);
      console.log("Archivo anterior eliminado");
    } catch (error) {
      // El archivo no existe, continuar normalmente
      console.log("No hay archivo anterior para eliminar");
    }

    // Guardar el nuevo archivo
    await writeFile(audioFilePath, Buffer.from(audio.uint8Array));
    console.log("Nuevo audio guardado en:", audioFilePath);

    console.log("=== RETORNANDO RESPUESTA ===");

    return new NextResponse(Buffer.from(audio.uint8Array), {
      headers: {
        "Content-Type": audio.mimeType || "audio/mpeg",
        "Content-Disposition": 'attachment; filename="nuevo_audio.mp3"',
        "Content-Length": audio.uint8Array.length.toString(),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("=== ERROR CAPTURADO ===");
    console.error("Tipo de error:", error.constructor.name);
    console.error("Mensaje:", error.message);
    console.error("Stack:", error.stack);

    // Diferentes tipos de errores
    if (error.message?.includes("API key")) {
      return NextResponse.json(
        { error: "Problema con la API key de OpenAI", details: error.message },
        { status: 401 }
      );
    }

    if (error.message?.includes("fetch")) {
      return NextResponse.json(
        { error: "Error de conexión con OpenAI", details: error.message },
        { status: 502 }
      );
    }

    if (
      error.message?.includes("ENOENT") ||
      error.message?.includes("permission")
    ) {
      return NextResponse.json(
        { error: "Error de permisos o archivo", details: error.message },
        { status: 500 }
      );
    }

    // Error genérico con más información
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error.message,
        type: error.constructor.name,
        stack: error.stack?.split("\n").slice(0, 5), // Primeras 5 líneas del stack
      },
      { status: 500 }
    );
  }
}

// Agregar OPTIONS para CORS si es necesario
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
