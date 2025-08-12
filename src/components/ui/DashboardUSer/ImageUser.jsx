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
    const tokenString = localStorage.getItem("auth-token");
    if (tokenString) {
      try {
        const parsed = JSON.parse(tokenString);
        setUserData(parsed);

        const name =
          parsed?.user?.user_metadata?.full_name ||
          parsed?.user_metadata?.full_name ||
          null;

        const avatarDirect =
          parsed?.user?.user_metadata?.avatar_url ||
          parsed?.user_metadata?.avatar_url;

        const emailFallback =
          parsed?.user?.user_metadata?.email || parsed?.user_metadata?.email;
        // Generar URL de avatar usando DiceBear
        if (avatarDirect) {
          setAvatar(avatarDirect);
        } else if (emailFallback) {
          const diceBearUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
            emailFallback
          )}`;
          setAvatar(diceBearUrl);
        } else {
          setAvatar(null); // o una imagen por defecto
        }
        if (name) {
          setUsername(name);
        }
      } catch (e) {
        console.error("Error al parsear o generar avatar:", e);
      }
    }
  }, []);

  const emailFallback =
    userData?.user?.user_metadata?.email || userData?.user_metadata?.email;

  if (!userData)
    return (
      <div>
        <Button variant="primary" onClick={() => router.push("/log/signup")}>
          Sign Up
        </Button>
      </div>
    );

  return (
    <div className="sticky bottom-0 bg-sidebar">
      <div className=" bg-sidebar hover:bg-background rounded-md mb-2 py-2 px-4 w-full">
        <div className="flex items-center">
          <img
            src={avatar}
            alt="avatar"
            className="w-8 rounded-full bg-slate-400"
          />
          <div className="flex flex-col items-start">
            <span>{username || "Anónimo"}</span>
            <span className="text-xs text-ring">
              {emailFallback || "Sin correo"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUser;
