"use client";

import NotVerified from "@/components/NotVerified";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();

  if (session.status === "loading") {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="m-auto animate-spin" />
      </div>
    );
  }

  if (session.status === "unauthenticated") {
    return children;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <NotVerified />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex flex-grow flex-col">{children}</div>
      </div>
    </div>
  );
}
