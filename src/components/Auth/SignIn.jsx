// src/components/Auth/SignIn.js
"use client";
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

import { useState } from "react";

function SignUp(props) {
  const { className, ...rest } = props;
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await Supabase.auth.signInWithOtp({
        email,
      });
      if (error) throw error;
    } catch (error) {
      console.log("Error al registrar:", error);
    }
  };

  const handleSubmitWithGoogle = async () => {
    await Supabase.auth.signInWithOAuth({
      provider: "google",
    
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
                  Inicia sesión en Wally Inc
                </p>
              </div>
              <div className="grid gap-5">
                <Label htmlFor="email">Correo</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Inicializar sesión
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
                ¿Aún no tienes una cuenta?{" "}
                <a href="/log/signup" className="underline underline-offset-4">
                  registrarte
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
