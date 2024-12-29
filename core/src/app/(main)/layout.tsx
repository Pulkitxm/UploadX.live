"use client";

import FileUploader from "@/components/FileUploader";
import NotVerified from "@/components/NotVerified";
import Sidebar from "@/components/Sidebar";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function MainAppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();

  useEffect(() => {
    try {
      if (!session.data?.user.img_token) return;
      const token = session.data.user.img_token;

      if (token) {
        document.cookie =
          "img_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `img_token=${token}`;
      }
    } catch (error) {
      if (error) {
        let a = 1;
        if (a) a++;
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
      <FileUploader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
