import React, { useEffect, useState } from "react";

function ImageUser() {
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
        <a href="/log/signUp" className="underline underline-offset-4">
          Sign Up
        </a>
      </div>
    );

  return (
    <div className="flex flex-row items-center">
      <img src={avatar} alt="avatar" className="w-13 rounded-full" />
      <span className="mt-2 text-sm">
        {userData.user.user_metadata.username}
      </span>
    </div>
  );
}

export default ImageUser;
