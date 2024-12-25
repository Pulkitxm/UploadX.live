"use server";

import VerifyEmail from "@/components/VerifyUser/verify-email";
import { NEXTAUTH_URL, RESEND_API_KEY } from "@/lib/constants";
import { setVerifyCode } from "@/lib/db/user";
import { ERROR } from "@/types/error";
import { RES_TYPE } from "@/types/global";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(email: string): Promise<RES_TYPE> {
  try {
    const code = genVerifyCode();
    const verifyUrl = `${NEXTAUTH_URL}/verify-email?token=${code}`;
    console.log(`verifyUrl: ${verifyUrl}`);

    const resDb = await setVerifyCode({ email, code });
    if (resDb.status === "error") {
      console.log("sendVerificationEmail error:", resDb.error);

      return resDb;
    }

    console.log(`resDb: ${resDb}`);

    const res = await resend.emails.send({
      from: "no-reply@uploadx.live",
      to: email,
      subject: "Verify your email",
      react: VerifyEmail({
        verificationCode: code,
        verificationUrl: verifyUrl,
      }),
    });

    console.log(`res: ${res}`);

    if (res.error) {
      console.log("sendVerificationEmail error:", res.error);

      return { status: "error", error: ERROR.EMAIL_SEND_ERROR };
    }

    return {
      status: "success",
      data: {
        verifyCodeChangeAttempts: resDb.data.verifyCodeChangeAttempts,
      },
    };
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    return { status: "error", error: ERROR.EMAIL_SEND_ERROR };
  }
}

function genVerifyCode() {
  return Math.random().toString(36).substring(2, 8);
}
