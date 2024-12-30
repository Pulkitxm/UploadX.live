"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);

  const field: {
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
  }[] = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      required: true
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      required: true
    }
  ];

  return (
    <form
      action={async (formData: FormData) => {
        try {
          setLoading(true);
          const values = {
            email: formData.get("email") as string,
            password: formData.get("password") as string
          };
          await signIn("credentials", {
            ...values,
            redirect: true,
            callbackUrl: "/"
          });
        } catch (error) {
          if (error) {
            setLoading(false);
          }
        }
      }}
    >
      <div className="space-y-4">
        {field.map((f, i) => (
          <Input key={i} name={f.name} type={f.type} placeholder={f.placeholder} required={f.required} />
        ))}
        <Button className="w-full" loading={loading}>
          Login
        </Button>
      </div>
    </form>
  );
}
