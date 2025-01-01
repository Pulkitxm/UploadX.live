"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

import { signUp } from "@/actions/auth";
import { showToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Auth } from "@/lib/auth";
import { AuthMode } from "@/types/auth";
import { ERROR } from "@/types/error";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const field: {
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
  }[] = [
    {
      name: "name",
      type: "text",
      placeholder: "Name",
      required: true
    },
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
    },
    {
      name: "rePassword",
      type: "password",
      placeholder: "Confirm Password",
      required: true
    }
  ];

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const formValues = {
      email: formData.get("email") as string,
      name: formData.get("name") as string,
      password: formData.get("password") as string,
      rePassword: formData.get("rePassword") as string,
      username: ""
    };

    formValues.username = formValues.email.split("@")[0];

    if (!formValues.email || !formValues.name || !formValues.password || !formValues.rePassword) {
      setLoading(false);
      return showToast({
        message: ERROR.REQUIRED,
        type: "error"
      });
    }

    if (formValues.password !== formValues.rePassword) {
      setLoading(false);
      return showToast({
        message: ERROR.PASSWORD_MISMATCH,
        type: "error"
      });
    } else {
      try {
        const res = await signUp(formValues);

        if (res.status === "error") {
          showToast({
            message: res.error,
            type: "error"
          });
        } else {
          const res = await new Auth({
            mode: AuthMode.EMAIL,
            user: {
              name: formValues.name,
              email: formValues.email
            }
          }).sendEmail();
          if (res.status === "error") {
            return showToast({
              message: res.error,
              type: "error"
            });
          }

          await signIn("credentials", {
            email: formValues.email,
            password: formValues.password,
            callbackUrl: "/"
          });

          router.push("/");
          showToast({
            message: "You have successfully registered",
            type: "success"
          });
        }
      } catch (error) {
        if (error) {
          showToast({
            message: ERROR.UNEXPECTED,
            type: "error"
          });
          setLoading(false);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSignUp}>
      {field.map((input) => (
        <Input
          key={input.name}
          type={input.type}
          name={input.name}
          placeholder={input.placeholder}
          required={input.required}
        />
      ))}
      <Button type="submit" className="w-full" loading={loading}>
        Register
      </Button>
    </form>
  );
}
