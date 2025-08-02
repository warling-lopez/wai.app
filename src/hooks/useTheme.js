// src/lib/useTheme.js o useTheme.ts
import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "system";
    }
    return "system";
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const appliedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.classList.remove("light", "dark");
    root.classList.add(appliedTheme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
