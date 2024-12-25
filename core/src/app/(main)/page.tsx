"use client";

import { ERROR } from "@/types/error";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePage() {
  const session = useSession();

  if (session.status === "unauthenticated") {
    return redirect("/login?error=" + ERROR.UNAUTHORIZED);
  } else if (session.status === "authenticated") {
    return <div>Hey, {session.data?.user.name}</div>;
  }
}
