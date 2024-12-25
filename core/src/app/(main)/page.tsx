"use client";

import { ERROR } from "@/types/error";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePage() {
  const session = useSession();

  if (session.status === "unauthenticated") {
    return redirect("/login?error=" + ERROR.UNAUTHORIZED);
  } else if (session.status === "authenticated") {
    return (
      <div className="h-[500px] w-full">
        <p>Hey, {session.data?.user.name}</p>
      </div>
    );
  }
}
