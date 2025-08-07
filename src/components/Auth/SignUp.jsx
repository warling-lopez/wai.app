// src/components/Auth/SignIn.js
"use client";
import Swal from "sweetalert2";
import { Supabase } from "@/Supabase/Supabase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { FaMeta } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { GrApple } from "react-icons/gr";

import { useRef, useState } from "react";

function SignUp(props) {
  const { className, ...rest } = props;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    inputRef.current.setCustomValidity("");

    const { data: existing, error } = await Supabase.from("profiles")
      .select("email")
      .eq("email", email);

    if (error) {
      inputRef.current.setCustomValidity("Error al verificar el correo.");
      inputRef.current.reportValidity();
      return;
    }

    if (existing.length > 0) {
      inputRef.current.setCustomValidity("Este correo ya está registrado.");
      inputRef.current.reportValidity();
      return;
    }

    const { error: otpError } = await Supabase.auth.signInWithOtp({
      email,
      options: { data: { full_name: name } }, // usa tu variable real
    });

    if (otpError) {
      inputRef.current.setCustomValidity("No se pudo enviar el correo.");
      inputRef.current.reportValidity();
      return;
    }

    // Todo bien, limpiamos error por si acaso
    inputRef.current.setCustomValidity("");
    Swal.fire({
      title: "Correo enviado correctamente!",
      icon: "success",
      draggable: true,
    });
  };

  const handleSubmitWithGoogle = async () => {
    await Supabase.auth.signInWithOAuth({
      provider: "google",
       options: {
        redirectTo: `${window.location.origin}/chat`,
      queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    }}
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-8 md:p-10" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido a WALLY</h1>
                <p className="text-balance text-muted-foreground">
                  Crea tu cuenta en Wally Inc
                </p>
              </div>

              <div className="grid gap-5">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="grid gap-5">
                <Label htmlFor="email">Correo</Label>
                <Input
                  ref={inputRef}
                  onChange={(e) => {
                    inputRef.current.setCustomValidity(""); // limpiar al escribir
                    setEmail(e.target.value);
                  }}
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Registrarse
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  {/* Apple */}
                  <GrApple />
                  <span className="sr-only">Login con Apple</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleSubmitWithGoogle}
                  className="w-full"
                >
                  {/* Google */}
                  <FaGoogle />
                  <span className="sr-only">Login con Google</span>
                </Button>

                <Button variant="outline" className="w-full">
                  {/* Meta */}
                  <FaMeta />
                  <span className="sr-only">Login con Meta</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                ¿Ya tienes una cuenta?{" "}
                <a href="/log/signin" className="underline underline-offset-4">
                  Inicia sesión
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <Image
              width="300"
              height="300"
              src="/Wally.png"
              alt="Wally"
              priority
              className="absolute inset-0 dark:grayscale animationForIAWallyLognIn"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al registrarte, aceptas los <a href="#">Términos y Servicios</a> y las{" "}
        <a href="#">Políticas de Privacidad</a>.
      </div>
    </div>
  );
}

export default SignUp;
