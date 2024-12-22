import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthGoogle } from "@/components/Auth/AuthWithGoogle";
import LoginError from "@/components/LoginError";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Suspense } from "react";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {mode === "login" && (
        <Suspense fallback={null}>
          <LoginError />
        </Suspense>
      )}
      <div className="container mx-auto mt-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {
                {
                  login: "Login to UploadX",
                  register: "Register for UploadX",
                }[mode]
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === "login" ? <LoginForm /> : <RegisterForm />}
            <div className="mt-4 text-center">
              <p>Or</p>
              <AuthGoogle />
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href={mode === "login" ? "/register" : "/login"}
                className="text-blue-600 hover:underline"
              >
                {mode === "login" ? "Register" : "Login"}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
