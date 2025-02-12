"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { TbReload } from "react-icons/tb";

import { getAttemptsLeftWithSession, sendVerificationEmailWithSession, verifyUserWithSession } from "@/actions/user";
import { showToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MAX_VERIFICATION_ATTEMPTS_LIMIT, MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT } from "@/lib/config";
import { ERROR } from "@/types/error";

export default function VerifyEmailWidget({ initialValue }: { initialValue: string | null }) {
  const session = useSession();
  const [code, setCode] = useState(initialValue || "");
  const [initalCallDone, setInitalCallDone] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [userTries, setUserTries] = useState({
    verifyCodeAttempts: MAX_VERIFICATION_ATTEMPTS_LIMIT,
    verifyCodeChangeAttempts: MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT
  });

  const attemptsLeft = {
    verifyCodeAttempts: MAX_VERIFICATION_ATTEMPTS_LIMIT - userTries.verifyCodeAttempts,
    verifyCodeChangeAttempts: MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT - userTries.verifyCodeChangeAttempts
  };

  const email = session.data?.user?.email || "";
  const name = session.data?.user?.name || "";

  const handleGetAttemptsLeft = useCallback(async () => {
    const at = await getAttemptsLeftWithSession();
    if (at.status === "success") {
      if (at.data === null) return;
      const atLeft = at.data as {
        verifyCodeChangeAttempts: number;
        verifyCodeAttempts: number;
      };
      setUserTries({
        verifyCodeAttempts: atLeft.verifyCodeAttempts,
        verifyCodeChangeAttempts: atLeft.verifyCodeChangeAttempts
      });
    } else {
      setUserTries({
        verifyCodeAttempts: MAX_VERIFICATION_ATTEMPTS_LIMIT,
        verifyCodeChangeAttempts: MAX_VERIFICATION_RESEND_ATTEMPTS_LIMIT
      });
    }
  }, []);

  const handleVerify = useCallback(async () => {
    if (!email) return;
    setIsVerifying(true);
    try {
      const result = await verifyUserWithSession({
        code
      });

      if (result.status === "success") {
        showToast({
          type: "success",
          message: "Email verified successfully!"
        });
        await session.update();
      } else {
        setUserTries((prev) => ({
          ...prev,
          verifyCodeAttempts: prev.verifyCodeAttempts + 1
        }));
        showToast({
          message: result.error,
          type: "error"
        });
      }
    } catch (error) {
      console.log(error);

      showToast({
        message: ERROR.VERIFY_FAILED,
        type: "error"
      });
    } finally {
      setIsVerifying(false);
      if (initalCallDone) {
        setInitalCallDone(false);
      }
    }
  }, [email, code, session, initalCallDone]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleVerify();
    },
    [handleVerify]
  );

  const handleResend = useCallback(async () => {
    if (!email || !name) return;
    setIsResending(true);
    try {
      const res = await sendVerificationEmailWithSession();
      if (res.status === "success") {
        showToast({
          type: "success",
          message: "Verification email sent successfully!"
        });
        setUserTries((prev) => ({
          ...prev,
          verifyCodeChangeAttempts: res.data.verifyCodeChangeAttempts
        }));
      } else {
        showToast({
          type: "error",
          message: res.error
        });
      }
    } catch (error) {
      if (error)
        showToast({
          type: "error",
          message: ERROR.VERIFY_FAILED
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
      verifyUserWithSession({
        code: initialValue
      }).then(async (result) => {
        if (result.status === "success") {
          setInitalCallDone(true);
          await session.update();
        } else {
          showToast({
            message: result.error,
            type: "error"
          });
          setCode("");
        }
      });
    }
  }, [initialValue, email, code, initalCallDone, session]);

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
        <CardDescription>Enter the verification code sent to your email</CardDescription>
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
              disabled={isVerifying || !email || !code || attemptsLeft.verifyCodeAttempts <= 0}
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
          disabled={isResending || !email || attemptsLeft.verifyCodeChangeAttempts <= 0}
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
