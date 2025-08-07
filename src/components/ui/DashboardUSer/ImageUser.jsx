"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";

function ImageUser() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState("");
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const tokenString = localStorage.getItem(
      "auth-token"
    );
    if (tokenString) {
      try {
        const parsed = JSON.parse(tokenString);
        setUserData(parsed);

        const email = parsed?.user?.user_metadata?.email 
           ?? parsed?.user_metadata?.email 
           ?? null;
        const name = parsed?.user?.user_metadata?.full_name 
        ?? parsed?.user_metadata?.full_name 
        ?? null;
        // Generar URL de avatar usando DiceBear

        if (email) {
          const diceBearUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${email}`;
          setAvatar(diceBearUrl);
        }if (name) {
          setUsername(name);
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
    <div className="bottom-0 bg-background rounded-md items-center justify-center mb-2 p-4">
      <div className="flex justify-around items-center place-content-center">
        <img
          src={avatar}
          alt="avatar"
          className="w-6 rounded-full bg-slate-400"
        />
        <span>{username || "Anónimo"}</span>
      </div>
    </div>
  );
}

export default ImageUser;
