import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button";
import { PaperPlaneIcon, GlobeIcon } from "@radix-ui/react-icons";
function InputReq({
  className,
  type,
  ...props
}) {
  return (
    <div className="rounded-4xl pr-1 pl-1 border shadow-xl w-[80%] md:w-[40%]">
        <input
      type={type}
      placeholder="Preguntale a WALLY"
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary text-gray-700 selection:text-primary-foreground dark:bg-input/30 border-input flex h-15 w-full min-w-0 border-0 bg-transparent px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl",
        className
      )}
      {...props}/>
      <div className="w-full flex justify-end">
        <Button className="rounded-full relative right-2 bottom-2"><PaperPlaneIcon/></Button>
      </div>
    </div>
    
  );
}

export { InputReq }
