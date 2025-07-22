"use client";

import { Calendar, Home, IdCard, Inbox, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import ImageUser from "@/components/ui/DashboardUSer/ImageUser";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function AppSidebar() {
    const router = useRouter();

  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("General");

  const settingsTabs = ["General", "Apariencia", "Avanzado"];

  const items = [
    { title: "Home", url: "/", icon: Home },
    { title: "Login", url: "/log/signup", icon: IdCard },
    { title: "Pruevas", url: "/c/[uid]/", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    {
      title: "Settings",
      icon: Settings,
      action: () => setShowSettings(true),
    },
  ];
  const saveLoader = () => {
    Swal.fire({
      title: "Estas seguro?",
      text: "Tu cuenta cerrará sesión de inmediato en este navegador!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
        localStorage.clear()
        router.push("/IA");
      }
    });
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>WALLY MENU</SidebarGroupLabel>
            <SidebarGroupContent className={"flex justify-between flex-wrap"}>
              <SidebarMenu className={"flex flex-col gap-2"}>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() =>
                          item.action ? item.action() : router.push(item.url)
                        } 
                        className="flex items-center gap-2"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <ImageUser />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-3xl h-[500px] flex rounded-lg shadow-lg overflow-hidden">
            {/* Tabs laterales */}
            <div className="w-1/4 bg-gray-100 p-4 space-y-2 border-r">
              {settingsTabs.map((tab) => (
                <button
                  key={tab}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeTab === tab
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Contenido dinámico */}
            <div className="w-3/4 p-6 overflow-y-auto relative">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                onClick={() => setShowSettings(false)}
              >
                ✖
              </button>

              {activeTab === "General" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Configuración General
                  </h2>
                  <Switch />
                </div>
              )}
              {activeTab === "Apariencia" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Apariencia</h2>
                  <p>Modo claro, oscuro, tamaños de letra, etc.</p>
                </div>
              )}
              {activeTab === "Avanzado" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Configuración Avanzada
                  </h2>
                  <p>Parámetros del modelo, tokens, temperatura, etc.</p>
                  <Button variant="destructive" onClick={saveLoader}>
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
