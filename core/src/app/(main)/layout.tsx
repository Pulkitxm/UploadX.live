"use client";

import NotVerified from "@/components/NotVerified";
import Sidebar from "@/components/Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();

  useEffect(() => {
    try {
      if (!session.data?.user.img_token) return;
      const token = session.data.user.img_token;

      if (token) {
        console.log("setting token");

        document.cookie =
          "img_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `img_token=${token}`;
      }
    } catch (error) {
      if (error) {
        let a = 1;
      }
    }
  }, [session.data?.user.img_token]);

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
    <div className="flex h-full flex-col">
      <NotVerified />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-4 md:p-6">{children}</div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}
