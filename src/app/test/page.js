// app/speech-client/page.tsx o page.jsx
'use client';
import React, { useState, useRef, useEffect } from "react"; // ← Agregado useRef y useEffect
import { InputReq } from "@/components/ui/inputReq";
import Msg from "@/components/ui/msg";
  
export default function SpeechClient() {
  const [loading, setLoading] = useState(false);

  const generarAudio = async () => {
    setLoading(true);
    const res = await fetch('/api/speech', {
      method: 'POST',
      body: JSON.stringify({ text: "El sistema adámico se refiere a una variedad de creencias y doctrinas, predominantemente religiosas, centradas en la figura de Adán, el primer hombre según las tradiciones abrahámicas (judaísmo, cristianismo e islam). No hay un único \"sistema adámico\" universalmente aceptado, sino más bien diferentes interpretaciones y énfasis sobre la importancia de Adán en la teología y la historia de la humanidad. Aquí te desgloso algunos aspectos comunes asociados al concepto del sistema adámico: Adán como figura central: Se le considera el prototipo de la humanidad, creado directamente por Dios, perfecto y en un estado de inocencia original. La Caída: El evento en el que Adán y Eva desobedecen a Dios, comiendo del fruto prohibido del árbol del conocimiento del bien y del mal. Este acto se considera la causa de la introducción del pecado, el sufrimiento y la muerte en el mundo. Pecado original: La creencia de que la naturaleza humana está inherentemente corrompida debido al pecado de Adán. Las diferentes denominaciones cristianas tienen diferentes interpretaciones sobre cómo se transmite este pecado y sus efectos. La promesa de redención: En muchas interpretaciones, especialmente en el cristianismo, la figura de Adán se contrapone a la figura de Jesucristo. Cristo se considera el \"nuevo Adán\" que vino a redimir a la humanidad de las consecuencias del pecado adámico, ofreciendo salvación a través de su sacrificio. Justicia social y raza: Históricamente, algunas interpretaciones erróneas del concepto de Adán, especialmente en contextos de supremacía blanca, se han utilizado para justificar la esclavitud o la desigualdad racial. Estas interpretaciones, basadas en ideas pseudocientíficas y teológicas, afirmaban que diferentes \"razas\" descendían de diferentes \"Adanes\" o que algunas razas eran anteriores a Adán y, por lo tanto, no eran plenamente humanas. Es crucial señalar que estas interpretaciones son altamente problemáticas, científicamente refutadas y moralmente reprobables. La idea de la descendencia común de toda la humanidad de Adán generalmente promueve la idea de la igualdad inherente de todos los seres humanos. Restauracionismo: Algunas religiones restauracionistas, como el mormonismo (Iglesia de Jesucristo de los Santos de los Últimos Días), tienen perspectivas únicas sobre Adán, considerándolo un ser glorificado que vino a la Tierra para iniciar el plan de salvación. En resumen: El sistema adámico, en su sentido más amplio, se refiere al conjunto de creencias relacionadas con Adán, la Caída, el pecado original y la promesa de redención. Es importante examinar cualquier discusión sobre este tema con un ojo crítico, especialmente cuando se utiliza para justificar la desigualdad o la discriminación. Es fundamental estudiar las diferentes interpretaciones del sistema adámico en su contexto religioso y cultural original, evitando el uso de conceptos fuera de contexto para defender ideologías perjudiciales." }),
      headers: { 'Content-Type': 'application/json' },
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
    setLoading(false);
  };
  const funciones = () => {
    //  funciones que deseo ejecutar
    generarAudio();
    
  }
  const [messages, setMessages] = useState([
      { role: "assistant", content:"" },
      { role: "user", content: "wercome user" },
    ]);
    const [isTyping, setIsTyping] = useState(false);
  
    const bottomRef = useRef(null); // ← Agregado
  
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // ← Scroll automático
  
    async function handleSendMessage(userInput) {
      setMessages((prev) => [...prev, { role: "user", content: userInput }]);
      setIsTyping(true);
  
      try {
        const res = await fetch("/api/server", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userInput }),
        });
  
        const data = await res.json();
        const fullText = data.message || "";
  
        // Mostrar palabra por palabra
        let index = 0;
        let words = fullText.split(" ");
        let generated = "";
  
        const interval = setInterval(() => {
          if (index < words.length) {
            generated += (index === 0 ? "" : " ") + words[index];
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                // Actualizar último mensaje assistant
                return [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: `${generated}` },
                ];
              } else {
                return [...prev, { role: "assistant", content: `${generated}` }];
              }
            });
            index++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
          }
        }); // tiempo entre cada palabra
      } catch (error) {
        console.error("Error al obtener respuesta:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error al contactar la API." },
        ]);
        setIsTyping(false);
      }
    }
    
  return (<>
        <div className="grid h-[100vh] w-full col-span-3 ">
          <div className="flex flex-col w-[100%] md:w-[100%] items-center p-4 overflow-y-auto">
            <div className="w-full top-0 md:w-[70vw] xl:w-[40vw]">
              {messages.map((msg, idx) => (
                <Msg key={idx} role={msg.role} content={msg.content} />
              ))}
              <div ref={bottomRef} /> {/* ← Scroll final */}
            </div>
          </div>
          <div className="flex justify-center items-center p-4">
            <InputReq onSend={handleSendMessage} />
          </div>
        </div>
    <div>
      <button onClick={funciones} disabled={loading}>
        {loading ? 'Generando...' : 'Reproducir voz'}
      </button>
    </div>

  </>);
}
