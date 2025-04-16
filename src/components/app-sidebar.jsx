"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
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
import { Switch } from "@/components/ui/switch"

import { useState } from "react";

export function AppSidebar() {
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState("General");

  const settingsTabs = ["General", "Apariencia", "Avanzado"];

  const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Inbox", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Search", url: "#", icon: Search },
    {
      title: "Settings",
      icon: Settings,
      action: () => setShowSettings(true),
    },
  ];

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() =>
                          item.action ? item.action() : (window.location.href = item.url)
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
                    activeTab === tab ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"
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
                  <h2 className="text-xl font-bold mb-4">Configuración General</h2>
                  <Switch/>
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
                  <h2 className="text-xl font-bold mb-4">Configuración Avanzada</h2>
                  <p>Parámetros del modelo, tokens, temperatura, etc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
