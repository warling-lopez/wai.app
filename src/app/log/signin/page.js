"use client";
import SignUp from "@/components/Auth/SignUp";

export default function SignIn() {
  return (
    <div className="flex w-full min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUp />
      </div>
    </div>
  );
}
