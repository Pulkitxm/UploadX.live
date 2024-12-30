"use server";

import VerifyEmail from "@/components/VerifyUser/verify-email";
import { NEXTAUTH_URL, RESEND_API_KEY } from "@/lib/constants";
import { setVerifyCode } from "@/prisma/db/user";
import { genVerifyCode } from "@/lib/utils";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail({
  email,
  userId
}: {
  userId?: string;
  email: string;
}): Promise<RES_TYPE> {
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

    if (res.error) {
      console.log("sendVerificationEmail error:", res.error);

      return { status: "error", error: ERROR.EMAIL_SEND_ERROR };
    }

    return {
      status: "success",
      data: {
        verifyCodeChangeAttempts: resDb.data.verifyCodeChangeAttempts,
        verifyUrl
      }
    };
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    return { status: "error", error: ERROR.EMAIL_SEND_ERROR };
  }
}
