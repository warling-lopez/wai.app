"use client";
import SignIn from "@/components/Auth/SignIn";

export default function Login() {
  console.log("hola")
  console.log(typeof SignIn)

  return (
    <div className="flex w-full min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignIn />
      </div>
    </div>
  );
}
