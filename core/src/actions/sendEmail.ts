"use server";

import { Resend } from "resend";

import VerifyEmail from "@/components/VerifyUser/verify-email";
import { NEXTAUTH_URL, RESEND_API_KEY } from "@/lib/constants";
import { genVerifyCode } from "@/lib/utils";
import { setVerifyCode } from "@/prisma/db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail({ email, userId }: { userId?: string; email: string }): Promise<RES_TYPE> {
  try {
    const code = genVerifyCode();
    const verifyUrl = `${NEXTAUTH_URL}/api/verify?code=${code}`;

    const resDb = await setVerifyCode({
      userId,
      code,
      email
    });

    if (resDb.status === "error") {
      console.log("sendVerificationEmail error:", resDb.error);
      return resDb;
    }

    const res = await resend.emails.send({
      from: "no-reply@uploadx.live",
      to: email,
      subject: "Verify your email",
      react: VerifyEmail({
        verificationCode: code,
        verificationUrl: verifyUrl
      })
    });

    console.log({ email, code, verifyUrl, resDb, res });

    if (res.error) {
      console.log("sendVerificationEmail error:", res.error);

      return {
        status: "error",
        error: ERROR.EMAIL_SEND_ERROR
      };
    }

    return {
      status: "success",
      data: {
        verifyCodeChangeAttempts: resDb.data.verifyCodeChangeAttempts
      }
    };
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    return {
      status: "error",
      error: ERROR.EMAIL_SEND_ERROR
    };
  }
}
