"use client";
import { useEffect } from "react";
import { Calendar, SquarePen, Search, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ImageUser from "@/components/ui/DashboardUSer/ImageUser";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import SwitchTheme from "./ui/switchTheme";
import ChatsList from "@/hooks/handleforViewChatsOfUsers";
import handleNewChat from "@/components/handle-newChat";

export function AppSidebar() {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const { openMovile, setOpenMobile } = useSidebar(); // <-- Usa el contexto

  const settingsTabs = ["General", "Apariencia", "Avanzado"];

  const items = [
    { title: "Nuevo Chat", icon: SquarePen, action: handleNewChat },
    { title: "Search", url: "#", icon: Search },
    { title: "Calendar", url: "#", icon: Calendar },
    {
      title: "Settings",
      icon: Settings,
      action: () => {
        setShowSettings(true);
        setOpenMobile(false); // Aquí se controla el sidebar real
      },
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
          text: "Your perfil has been deleted.",
          icon: "success",
        });
        localStorage.clear();
        sessionStorage.clear();
        router.refresh("/chat");
      }
    });
  };
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup className="flex h-full flex-nowrap relative">
            <SidebarGroupContent
              className={
                "flex justify-between bg-sidebar flex-wrap sticky top-0"
              }
            >
              <SidebarGroupLabel>WALLY MENU</SidebarGroupLabel>
              <div>
                <SidebarTrigger
                  style={{ fontSize: "10rem" }}
                  className="sticky top-0 text-4xl"
                />
              </div>
              <SidebarMenu className={"flex flex-col gap-2 text-sm"}>
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
            </SidebarGroupContent>
            <div className="flex-1">
              <ChatsList />
            </div>
            <ImageUser />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center ">
          <div className="bg-background text-foreground w-[90%] max-w-3xl h-[500px] flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden relative">
            {/* Botón cerrar siempre arriba */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
              onClick={() => setShowSettings(false)}
            >
              ✖
            </button>

            {/* Tabs: arriba en móvil, izquierda en escritorio */}
            <div className=" md:w-1/4 bg-background p-4 md:space-y-0 md:space-x-0 flex md:flex-col flex-row md:border-r border-b md:border-b-0">
              {settingsTabs.map((tab) => (
                <button
                  key={tab}
                  className={`w-full text-left px-3 py-2 rounded-md font-medium ${
                    activeTab === tab
                      ? "bg-primary text-chart-3"
                      : "hover:bg-primary hover:text-chart-3"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Contenido dinámico */}
            <div className="p-6 overflow-y-auto relative">
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
                  <div className="flex items-center space-x-4 mt-4">
                    <label className="text-sm">Modo Oscuro</label>
                    <SwitchTheme />
                  </div>
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
