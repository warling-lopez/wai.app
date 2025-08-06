"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";

function ImageUser() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const tokenString = localStorage.getItem(
      "sb-hrgajcbtdlljpcwvenmf-auth-token"
    );
    if (tokenString) {
      try {
        const parsed = JSON.parse(tokenString);
        setUserData(parsed);

        const email = parsed?.user?.user_metadata?.email;
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
    <div className="flex flex-row h-full relative bottom-0 bg-background rounded-md items-center justify-center mb-2 p-4">
      <div className="grid grid-cols-2v w-10 items-center place-content-center">
        <img
          src={avatar}
          alt="avatar"
          className="w-6 rounded-full bg-slate-400"
        />
        <span>{userData?.user?.user_metadata?.full_name || "Anónimo"}</span>
      </div>
    </div>
  );
}

export default ImageUser;
