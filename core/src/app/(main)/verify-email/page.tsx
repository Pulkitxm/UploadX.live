"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import AlreadyVerified from "@/components/VerifyUser/already-verified";
import VerifyEmailWidget from "@/components/VerifyUser/verify-widget";

export default function VerifyEmail() {
  const session = useSession();
  const queryParams = useSearchParams();
  const token = queryParams.get("token");

  if (session.status === "authenticated")
    return (
      <div className="flex h-full w-full items-center justify-center">
        {session.data.user.isVerified ? <AlreadyVerified /> : <VerifyEmailWidget initialValue={token} />}
      </div>
    );
}
