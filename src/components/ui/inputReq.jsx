"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

function InputReq({ className, type = "text", onSend, ...props }) {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);

  const handleSendClick = () => {
    if (input.trim() !== "") {
      onSend(input);
      setInput("");

      // Resetear altura después de enviar
      const el = inputRef.current;
      if (el) {
        el.style.height = "60px";
      }
    }
  };

  return (
    <div className="rounded-4xl pr-1 pl-1 border shadow-xl top-0 w-full md:w-[70vw] xl:w-[40vw] mb-5">
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          e.target.style.height = "60px"; // Resetear altura
          e.target.style.height = e.target.scrollHeight + "px"; // Autoexpandir
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendClick();
          }
        }}
        placeholder="Pregúntale a WALLY"
        className={cn(
          "max-h-[200px] resize-none overflow-hidden placeholder:text-muted-foreground selection:bg-primary text-gray-700 selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 border-0 bg-transparent px-3 py-2 text-base outline-none h-[60px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl",
          className
        )}
        rows={1}
        {...props}
      />
      <div className="w-full flex justify-end">
        <Button
          onClick={handleSendClick}
          className="rounded-full relative right-2 bottom-2"
        >
          <PaperPlaneIcon />
        </Button>
      </div>
    </div>
  );
}

export { InputReq };
