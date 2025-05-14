"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Supabase } from "@/supabase/supabase";

export default function ProfilePage() {
  // 🎯 Aquí usamos useParams en vez de router.query
  const { uid } = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!uid) return;

    Supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Error cargando perfil:", error);
          router.replace(`/c/${session.user.id}`); // redirige al home si falla
        } else {
          setUserData(data);
        }
      });
  }, [uid, router]);

  if (!userData) return <p>Cargando perfil…</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">¡Hola, {userData.username}!</h1>
      <p className="mt-2">Email: {userData.email}</p>
      {/* resto de tu UI */}
    </div>
  );
}
