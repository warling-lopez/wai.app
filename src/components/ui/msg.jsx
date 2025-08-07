import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; // o usa clsx si no tienes cn
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";

import "prismjs/themes/prism-tomorrow.css";
import "@/components/css/prism-custom.css";


const Msg = ({ role, content }) => {
  const isUser = role === "user";
  const contentRef = useRef(null);
  Prism.highlightAll();
  return (
    <div
      className={cn(
        "w-full flex mb-2",
        isUser ? "justify-end break-words overflow-hidden" : "justify-start"
      )}
    >
      <div
        ref={contentRef}
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-xl whitespace-pre-wrap",
          isUser
            ? "bg-primary break-words overflow-hidden text-foreground rounded-br-none"
            : "bg-background text-foreground rounded-bl-none"
        )}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Msg;
