import React from "react";
import { cn } from "@/lib/utils"; // o usa clsx si no tienes cn
import ReactMarkdown from "react-markdown";

const Msg = ({ role , content }) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "w-full flex mb-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-xl text-md whitespace-pre-wrap",
          isUser
            ? "bg-gray-300 text-gray-900 rounded-br-none"
            : "bg-white text-gray-900 rounded-bl-none"
        )}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Msg;
