import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; // o usa clsx si no tienes cn
import { Marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-tomorrow.css";
import "@/components/css/custom-prism.css";


const Msg = ({ role, content }) => {
  const isUser = role === "user";
  const contentRef = useRef(null);
  Prism.highlightAll();
  const formattedHtml = Marked.parse(content);
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
          "max-w-[95%] px-4 py-2 rounded-xl whitespace-pre-wrap",
          isUser
            ? "bg-primary break-words overflow-hidden text-foreground rounded-br-none"
            : "bg-background text-foreground rounded-bl-none"
        )}
      >
      {formattedHtml}
      </div>
    </div>
  );
};

export default Msg;
