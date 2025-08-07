"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { Supabase } from "@/Supabase/Supabase";

import swal from "sweetalert2";

export default function ProfilePage() {
  const router = useRouter();
  const STORAGE_KEY = "sb-hrgajcbtdlljpcwvenmf-auth-token";

  const [authData, setAuthData] = useState(null);

  const [checkedAuth, setCheckedAuth] = useState(false);

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { user },
        error,
      } = await Supabase.auth.getUser();

      if (error) {
        console.error("Error al obtener usuario:", error);
        return null;
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      
      return user;
    };
    getUserInfo();
  }, []);

  // 1️⃣ Al montar: parsear hash y guardar todo en localStorage + estado
  useEffect(() => {
    const hash = window.location.hash; // ej: "#access_token=...&refresh_token=..."
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const data = {}; // <-- aquí un objeto JS común
      for (const [key, value] of params.entries()) {
        data[key] = value;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setAuthData(data);
    }
  }, []);

  // 2️⃣ Si no vino por hash, leer de sessionStorage
  useEffect(() => {
    if (authData === null) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setAuthData(JSON.parse(stored));
        } catch {
          console.error("Error parsing stored auth data");
        }
      }
    }
  }, [authData]);

  // 3️⃣ Tras 3s, mostrar alerta y redirigir UNA VEZ
  useEffect(() => {
    if (checkedAuth) return;
    const timer = setTimeout(() => {
      if (!authData) {
        swal
          .fire({
            title: "No tienes una cuenta!",
            text: "Por favor, regístrate o verifica tu cuenta!",
            icon: "info",
            confirmButtonText: "Registrarse",
          })
          .then(() => router.push("/log/signup"));
      } else {
        swal
          .fire({
            title: "Bienvenido de nuevo",
            text: "Estamos felices de verte otra vez.",
            icon: "success",
            confirmButtonText: "Continuar",
          })
          .then(() => {
            setTimeout(() => router.replace("/chat"), 500);
          });
      }
      setCheckedAuth(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [authData, checkedAuth, router]);

  return (
    <div className="flex w-[100vw] h-[95vh] items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <BiLoaderAlt className="h-12 w-12 text-slate-600 animate-spin" />
      </div>
    </div>
  );
}