import { experimental_generateSpeech as generateSpeech } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const text = body.text || 'Hola, esta es una prueba de voz.';

  const { audio } = await generateSpeech({
    model: openai.speech('gpt-4o-mini-tts', {
      apiKey: process.env.OPENAI_API_KEY,
    }),
    text,
    voice: 'shimmer',
    outputFormat: 'mp3',
  });

  return new NextResponse(Buffer.from(audio.uint8Array), {
    headers: {
      'Content-Type': audio.mimeType || 'audio/mpeg',
      'Content-Disposition': 'inline; filename="voz.mp3"',
      'Content-Length': audio.uint8Array.length.toString(),
    },
  });
}
