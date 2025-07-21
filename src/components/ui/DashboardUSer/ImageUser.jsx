import React, { useEffect, useState } from "react";

function ImageUser() {
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const tokenString = localStorage.getItem("sb-hrgajcbtdlljpcwvenmf-auth-token");
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

  if (!userData) return <div>Cargando perfil...</div>;

  return (
    <div className="flex flex-col items-center">
      <img
        src={avatar}
        alt="avatar del usuario"
        className="w-13 rounded-full"
      />
      <p className="mt-2 text-sm">¡Hola, {userData.user.user_metadata.username}!</p>
    </div>
  );
}

export default ImageUser;
