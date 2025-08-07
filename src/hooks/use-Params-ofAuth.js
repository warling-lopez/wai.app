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
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setAuthData(JSON.parse(stored));
        } catch {
          console.error("Error parsing stored auth data");
        }
      }
    }
  }, [authData]);  
}
