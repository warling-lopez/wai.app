import React, { useEffect, useState } from "react";
import { Supabase } from "@/supabase/supabase";

function ImageUser() {
  const [avatar, setAvatar] = useState(null);
  const [correo, setCorreo] = useState(null);

  useEffect(() => {
    const obtenerPerfil = async () => {
      try {
        // Obtener usuario autenticado
        const {
          data: { user },
          error: userError,
        } = await Supabase.auth.getUser();

        if (userError || !user) {
          console.error("Usuario no autenticado");
          return;
        }

        const correoUsuario = user.email;
        setCorreo(correoUsuario);

        // Buscar si ya tiene perfil en la tabla 'perfiles'
        const { data: perfil, error: perfilError } = await Supabase
          .from("perfiles")
          .select("foto")
          .eq("correo", correoUsuario)
          .single();

        if (perfilError && perfilError.code !== "PGRST116") {
          // PGRST116 = registro no encontrado
          console.error("Error al obtener perfil:", perfilError);
          return;
        }

        // Si tiene una foto en el perfil, usarla
        if (perfil && perfil.foto) {
          setAvatar(perfil.foto);
          return;
        }

        // Si no tiene foto, pero inició con Google, usar avatar de Google
        const proveedor = user.app_metadata?.provider;
        if (proveedor === "google") {
          const avatarGoogle = user.user_metadata?.avatar_url;
          if (avatarGoogle) {
            setAvatar(avatarGoogle);
            return;
          }
        }

        // Si no hay perfil ni Google, usar DiceBear
        const diceBearUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${correoUsuario}`;
        setAvatar(diceBearUrl);
      } catch (error) {
        console.error("Error general:", error);
      }
    };

    obtenerPerfil();
  }, []);

  if (!avatar || !correo) return <div>Cargando perfil...</div>;

  return (
    <div className="flex flex-col items-center">
      <img
        src={avatar}
        alt="avatar del usuario"
        className="w-24 h-24 rounded-full"
      />
      <p className="mt-2 text-sm">{correo}hola</p>
    </div>
  );
}

export default ImageUser;
