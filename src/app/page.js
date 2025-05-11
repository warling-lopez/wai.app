"use client";
import Link from "next/link";
import React from "react";
import { Supabase } from "@/supabase/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Page() {
  const direction = useRouter();

  useEffect(() => {
    Supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        direction.push("/IA");
      }
    });
  }, [direction]);
  
  return (
    <div className="w-[100vh] h-[95vh] flex justify-center align-center rounded-2xl bg-secondary">
      <Link href="/IA">
        <Image
          src="/Wally.png"
          alt="Imagen de Wally"
          className="animationForIAWallyImg"
          width={300}
          height={300}
        />
      </Link>
    </div>
  );
}

export default Page;
