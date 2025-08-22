// app/IA/layout.tsx
"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import "@/components/css/custom-prism.css"; // Asegúrate de que este archivo exista y contenga tus estilos globales
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const metadata = {
  title: "Workai",
  description: "it's a workai app",
};

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Valor por defecto
  const [isThemeSet, setIsThemeSet] = useState(false);

  useEffect(() => {
    // Leer estado del sidebar desde cookie
    const sidebarCookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("sidebar_state="));
    if (sidebarCookie) {
      const value = sidebarCookie.split("=")[1];
      setSidebarOpen(value === "true");
    }

    // Aplicar tema dark si corresponde
    const theme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme === "dark" || (!theme && systemPrefersDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setIsThemeSet(true);
  }, []);

  if (!isThemeSet) return null; // Evita el parpadeo blanco y errores de hidratación

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar />
      <main
        className={`grid w-full bg-background text-foreground ${roboto.className}`}
      >
        <SidebarTrigger
          style={{ fontSize: "10rem" }}
          className="sticky top-0 text-4xl pt-2"
        />
        <div className="m-2">{children}</div>
      </main>
    </SidebarProvider>
  );
}
