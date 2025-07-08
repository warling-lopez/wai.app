"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  // 🎯 Aquí usamos useParams en vez de router.query
  const router = useRouter();

  //const [userData, setUserData] = useState(null);
  const AI = () => {
    router.replace("/IA");
  };
  useEffect(() => {
    AI();
  }, []);

//  if (!userData) return <p>Cargando perfil…</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">¡Hola, {userData.username}!</h1>
      <p className="mt-2">Email: {userData.email}</p>
      {/* resto de tu UI */}
      <Button onClick={AI}>Entrar a la IA</Button>
    </div>
  );
}
