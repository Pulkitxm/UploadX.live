"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  return (
    <form
      action={async (formData: FormData) => {
        const values = {
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        };
        await signIn("credentials", {
          ...values,
          redirect: true,
          callbackUrl: "/",
        });
      }}
    >
      <div className="space-y-4">
        <Input name="email" type="email" placeholder="Email" required />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <Button className="w-full">Login</Button>
      </div>
    </form>
  );
}
