"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import swal from "sweetalert2";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false); // ← Para no repetir el efecto

  // Leer token del localStorage
  useEffect(() => {
    const tokenString = localStorage.getItem(
      "sb-hrgajcbtdlljpcwvenmf-auth-token"
    );
    if (tokenString) {
      try {
        const parsed = JSON.parse(tokenString);
        setUserData(parsed);
      } catch (e) {
        console.error("Error parsing token:", e);
        setUserData(null);
      }
    } else {
      console.error("No token found in localStorage");
      setUserData(null);
    }
  }, []);

  // Esperar 5s y verificar userData una sola vez
  useEffect(() => {
    if (checkedAuth) return;

    const timer = setTimeout(() => {
      if (userData === null) {
        swal
          .fire({
            title: "No tienes una cuenta",
            text: "Por favor, regístrate para continuar.",
            icon: "info",
            confirmButtonText: "Registrarse",
          })
          .then(() => {
            router.push("/log/signup");
          });
      } else {
        swal
          .fire({
            title: "Bienvenido de nuevo",
            text: "Estamos felices de verte otra vez.",
            icon: "success",
            confirmButtonText: "Continuar",
          })
          .then(() => {
            router.push("/IA");
          });
      }

      setCheckedAuth(true); // Marcar como ejecutado
    }, 5000);

    return () => clearTimeout(timer);
  }, [userData, checkedAuth]);

  return (
    <div className="flex w-[100vw] h-[95vh] items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <BiLoaderAlt className="h-12 w-12 text-slate-600 animate-spin" />
      </div>
    </div>
  );
}
