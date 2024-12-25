"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { getAttemptsLeft, verifyUser } from "@/lib/db/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TbReload } from "react-icons/tb";
import { AuthMode } from "@/types/auth";
import { Auth } from "@/lib/auth";
import { showToast } from "@/components/toast";
import {
  MAX_VERIFICATION_ATTEMPTS_LIMIT,
  MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT,
} from "@/lib/config";

export default function VerifyEmailWidget({
  initialValue,
}: {
  initialValue: string | null;
}) {
  const session = useSession();
  const [code, setCode] = useState(initialValue || "");
  const [initalCallDone, setInitalCallDone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [userTries, setUserTries] = useState({
    verifyCodeAttempts: MAX_VERIFICATION_ATTEMPTS_LIMIT,
    verifyCodeChangeAttempts: MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT,
  });

  const attemptsLeft = {
    verifyCodeAttempts:
      MAX_VERIFICATION_ATTEMPTS_LIMIT - userTries.verifyCodeAttempts,
    verifyCodeChangeAttempts:
      MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT -
      userTries.verifyCodeChangeAttempts,
  };

  const email = session.data?.user?.email || "";
  const name = session.data?.user?.name || "";

  const handleGetAttemptsLeft = useCallback(async () => {
    const at = await getAttemptsLeft(email);
    if (at.status === "success") {
      setUserTries({
        verifyCodeAttempts: at.data.verifyCodeAttempts,
        verifyCodeChangeAttempts: at.data.verifyCodeChangeAttempts,
      });
    } else {
      setUserTries({
        verifyCodeAttempts: MAX_VERIFICATION_ATTEMPTS_LIMIT,
        verifyCodeChangeAttempts: MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT,
      });
    }
  }, [email]);

  const handleVerify = useCallback(async () => {
    if (!email) return;
    setIsVerifying(true);
    try {
      const result = await verifyUser({ email, code });

      if (result.status === "success") {
        showToast({
          message: "Email verified successfully!",
          type: "success",
        });
      } else {
        showToast({
          message: result.error,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);

      showToast({
        message: "Failed to verify email. Please try again.",
        type: "error",
      });
    } finally {
      setIsVerifying(false);
      if (initalCallDone) {
        setInitalCallDone(false);
      }
    }
  }, [email, code, initalCallDone]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleVerify();
    },
    [handleVerify],
  );

  const handleResend = useCallback(async () => {
    if (!email || !name) return;
    setIsResending(true);
    try {
      const auth = new Auth({
        mode: AuthMode.EMAIL,
        user: {
          name,
          email,
        },
      });
      const res = await auth.verify();
      if (res.status === "success") {
        showToast({
          type: "success",
          message: "Verification email sent successfully!",
        });
        setUserTries((prev) => ({
          ...prev,
          verifyCodeChangeAttempts: res.data.verifyCodeChangeAttempts,
        }));
      } else {
        showToast({
          type: "error",
          message: res.error,
        });
      }
    } catch (error) {
      if (error)
        showToast({
          type: "error",
          message: "Failed to send verification email. Please try again.",
        });
    } finally {
      setIsResending(false);
    }
  }, [email, name]);

  useEffect(() => {
    if (session.status === "authenticated") {
      handleGetAttemptsLeft();
    }
  }, [session.data?.user?.email, session.status, handleGetAttemptsLeft]);

  useEffect(() => {
    if (initialValue && initalCallDone === false) {
      verifyUser({ email, code: initialValue }).then((result) => {
        if (result.status === "success") {
          setInitalCallDone(true);
          window.location.reload();
        } else {
          showToast({
            message: result.error,
            type: "error",
          });
          setCode("");
        }
      });
    }
  }, [initialValue, email, code, initalCallDone]);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }

  if (session.status === "unauthenticated") {
    return <div>Please sign in to verify your email.</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isVerifying}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={
                isVerifying ||
                !email ||
                !code ||
                attemptsLeft.verifyCodeAttempts <= 0
              }
              onClick={handleVerify}
            >
              {isVerifying ? (
                <>
                  <TbReload className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                `Verify Email (${attemptsLeft.verifyCodeAttempts})`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button
          onClick={handleResend}
          variant="outline"
          className="w-full"
          disabled={
            isResending || !email || attemptsLeft.verifyCodeChangeAttempts <= 0
          }
        >
          {isResending ? (
            <>
              <TbReload className="mr-2 h-4 w-4 animate-spin" />
              Resending...
            </>
          ) : (
            `Resend Verification Code (${attemptsLeft.verifyCodeChangeAttempts})`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
