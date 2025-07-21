"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
export default function ProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState(null);

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
      }
    }
  }, []);

  const AI = () => {
    router.replace("/IA");
  };

  if (!userData) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">
          <BiLoaderAlt />
        </div>
      </>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        ¡Hola, {userData.user.user_metadata.username}!
      </h1>
      <p className="mt-2">Email: {userData.user.user_metadata.email}</p>
      <Button onClick={AI}>Entrar a la IA</Button>
    </div>
  );
}
