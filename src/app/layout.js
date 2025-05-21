// app/layout.jsx
'use client';

import { useEffect } from "react";
import { Supabase } from "@/supabase/supabase";
import { useUserStore } from "@/store/useUserStore";
import "./globals.css"
export default function RootLayout({ children }) {
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    const cargarUsuario = async () => {
      const {
        data: { user },
      } = await Supabase.auth.getUser();

      if (user) {
        const correo = user.email;
        let avatar = null;

        const { data: perfil } = await Supabase
          .from("perfiles")
          .select("foto")
          .eq("correo", correo)
          .single();

        if (perfil?.foto) {
          avatar = perfil.foto;
        } else if (user.app_metadata?.provider === "google") {
          avatar = user.user_metadata?.avatar_url;
        } else {
          avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${correo}`;
        }

        setUser({
          correo,
          avatar,
          nombre: user.user_metadata?.name || "Usuario",
        });
      }
    };

    cargarUsuario();
  }, [setUser]);

  return (
    <html>
      <body>{children}
        <div>hola {setUser}</div>
      </body>
    </html>
  );
}
