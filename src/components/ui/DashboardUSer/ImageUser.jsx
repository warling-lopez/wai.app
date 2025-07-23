"use client"
import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";

function ImageUser() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState("");
  
  useEffect(() => {
    const tokenString = sessionStorage.getItem(
      "sb-hrgajcbtdlljpcwvenmf-auth-token"
    );
    if (tokenString) {
      try {
        const parsed = JSON.parse(tokenString);
        setUserData(parsed);

        const email = parsed?.user_metadata?.email;
        if (email) {
          const diceBearUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`;
          setAvatar(diceBearUrl);
        }
      } catch (e) {
        console.error("Error al parsear o generar avatar:", e);
      }
    }
  }, []);

  if (!userData)
    return (
      <div>
        <Button variant="primary" onClick={() => router.push("/log/signup")}>
          Sign Up
        </Button>
      </div>
    );

  return (
    <div className="flex flex-row items-center justify-evenly w-full">
      <img src={avatar} alt="avatar" className="w-10 rounded-full bg-slate-400" />
      <span className="mt-2 text-xl">
        {userData?.user_metadata?.username || "Usuario Anónimo"}
      </span>
    </div>
  );
}

export default ImageUser;
