import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; // O tu utilidad de clases
import { marked } from "marked";
import DOMPurify from "dompurify";
import Prism from "prismjs";

// Importa los lenguajes que necesites
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";
import "@/components/css/custom-prism.css";

// Configura marked para usar la extensión de resaltado de Prism
marked.setOptions({
  highlight: function (code, lang) {
    const language = Prism.languages[lang] || Prism.languages.markup;
    return Prism.highlight(code, language, lang);
  },
});

const Msg = ({ role, content }) => {
  const isUser = role === "user";
  const contentRef = useRef(null);

  useEffect(() => {
    // Al re-renderizar, se asegura de que Prism resalta el código en el DOM
    if (contentRef.current) {
      Prism.highlightAllUnder(contentRef.current);
    }
  }, [content]); // Se ejecuta solo cuando el 'content' cambia

  // Genera el HTML sanitizado fuera del renderizado del DOM
  const rawHtml = marked.parse(content);
  const safeHtml = DOMPurify.sanitize(rawHtml);

  return (
    <div
      className={cn(
        "w-full flex",
        isUser ? "justify-end break-words overflow-hidden" : "justify-start"
      )}
    >
      <div
        ref={contentRef}
        className={cn(
          "max-w-[95%] px-4 py-2 rounded-xl m-2",
          isUser
            ? "bg-primary break-words overflow-hidden text-foreground rounded-br-none"
            : "bg-background text-foreground rounded-bl-none"
        )}
        // Inyecta el HTML sanitizado
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      ></div>
    </div>
  );
};

export default Msg;
