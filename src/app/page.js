"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  
  const AI = () => {
    router.replace("/IA");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        ¡Hola,{" "}
        
      </h1>
      <p className="mt-2">Email: {/*userData.email*/}</p>
      <Button onClick={AI}>Entrar a la IA</Button>
    </div>
  );
}