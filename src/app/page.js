"use client"
import Link from "next/link";
import React from "react";
import { Supabase } from "@/supabase/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function page() {
  const direction = useRouter();

  useEffect(()=>{
    Supabase.auth.onAuthStateChange((event, session)=>{
      if(!session){
         direction.push("/IA")
      }
    })
  },[])
  return (
    <div className="w-[100vh] h-[95vh] flex justify-center align-center rounded-2xl bg-secondary">
      <Link href="/IA">
        <img src="/Wally.png" className="animationForIAWallyImg" />
      </Link>
    </div>
  );
}

export default page;
