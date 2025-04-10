import React from "react";
import { cn } from "@/lib/utils"; // o reemplaza con clsx si no tienes esta utilidad

const Msg = ({ role = "user", content = "" }) => {
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
          "max-w px-4 py-2 rounded-xl  text-md",
          isUser
            ? "bg-gray-300 text-gray-900 rounded-br-none"
            : " text-gray-900 rounded-bl-none"
        )}
      >
        {content}
      </div>
    </div>
  );
};

export default Msg;
