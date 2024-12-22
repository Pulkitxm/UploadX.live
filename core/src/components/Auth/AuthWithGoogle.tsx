"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export function AuthGoogle() {
  return (
    <Button
      variant="outline"
      className="mt-2 w-full"
      onClick={() => signIn("google")}
    >
      <FaGoogle />
      Continue with Google
    </Button>
  );
}
