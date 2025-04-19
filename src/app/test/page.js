// app/speech-client/page.tsx o page.jsx
'use client';

import { useState } from 'react';

export default function SpeechClient() {
  const [loading, setLoading] = useState(false);

  const generarAudio = async () => {
    setLoading(true);
    const res = await fetch('/api/speech', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hola Warling, ¡esto es Next.js!' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    setLoading(false);
  };

  return (
    <div>
      <button onClick={generarAudio} disabled={loading}>
        {loading ? 'Generando...' : 'Reproducir voz'}
      </button>
    </div>
  );
}
