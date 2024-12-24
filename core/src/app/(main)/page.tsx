"use client";

import LandingPage from "@/components/LandingPage";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const session = useSession();

  if (session.status === "unauthenticated") {
    return <LandingPage />;
  } else if (session.status === "authenticated") {
    return <div>Hey, {session.data?.user.name}</div>;
  }
}
