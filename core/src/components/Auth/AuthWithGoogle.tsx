"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

import { Button } from "@/components/ui/button";

export function AuthGoogle() {
  return (
    <Button variant="outline" className="mt-2 w-full" onClick={() => signIn("google")}>
      <FaGoogle />
      Continue with Google
    </Button>
  );
}
