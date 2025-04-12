import React from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

const Msg = ({ role = "user", content}) => {
  const isUser = role === "user";
  content = "Claro, aquí te dejo una lista de algunos de los lenguajes de programación más populares y ampliamente utilizados en la actualidad: ## Lenguajes de Programación Populares 1. **Python** 2. **JavaScript** 3. **Java** 4. **C++** 5. **C#** 6. **PHP** 7. **Ruby** 8. **Swift** 9. **R** 10. **Kotlin** Cada uno de estos lenguajes tiene sus propias ventajas y se utiliza en diferentes áreas de la programación, desde el desarrollo web hasta la inteligencia artificial. ¡Espero que esta lista te sea útil!"
  return (
    <div
      className={cn(
        "w-full flex mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w px-4 py-2 rounded-xl text-md",
          isUser
            ? "bg-gray-300 text-gray-900 rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none"
        )}
      >
        <ReactMarkdown children={content} />
      </div>
    </div>
  );
};

export default Msg;
