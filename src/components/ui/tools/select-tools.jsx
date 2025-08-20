"use client";
import { Button } from "@/components/ui/button";
import { MdOutlineAttachFile } from "react-icons/md";
import { FiTool, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { cn } from "@/lib/utils"

export function ToolSelector() {
  const [selected, setSelected] = useState("attach");
  const [open, setOpen] = useState(false);

 const tools = [
  { id: "attach", label: "Tools", icon: <FiTool className="w-5 h-5" /> },
  { id: "search", label: "Buscar", icon: <FiSearch className="w-5 h-5" /> },
];
  const activeTool = tools.find((t) => t.id === selected);

  return (
    <div className="relative inline-block">
      {/* Botón principal (el que se ve siempre) */}
      <Button
        type="button"
        variant="tool_outline"
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2"
      >
        {activeTool?.icon}
        <span>{activeTool?.label}</span>
      </Button>

      {/* Dropdown de opciones */}
      {open && (
        <div className="absolute bottom-full mb-2 w-36 rounded-md  bg-background dark:bg-neutral-900 shadow-lg overflow-hidden z-10">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setSelected(tool.id);
                setOpen(false);
              }}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800",
                selected === tool.id && "bg-gray-200 dark:bg-neutral-700 font-semibold"
              )}
            >
              {tool.icon}
              <span className="ml-2">{tool.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
