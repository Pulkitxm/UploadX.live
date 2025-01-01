"use client";

import { Session } from "next-auth";
import { useEffect } from "react";

import { UploadManagerMinimizeProvider, UploadsProvider } from "@/state/providers/uploadsProvider";

import { FilesProvider } from "./fileProvider";

export default function Providers({ children, session }: { children: React.ReactNode; session: Session }) {
  useEffect(() => {
    try {
      if (!session?.user.img_token) return;
      const token = session.user.img_token;
      console.log(process.env.NODE_ENV);

      if (token) {
        document.cookie = "img_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.uploadx.live;";
        document.cookie = `img_token=${token}; path=/; domain=.uploadx.live; secure; SameSite=None;`;
      }
    } catch (error) {
      if (error) {
        let a = 1;
        if (a) a++;
      }
    }
  }, [session?.user.img_token]);

  return (
    <UploadsProvider>
      <FilesProvider>
        <UploadManagerMinimizeProvider>{children}</UploadManagerMinimizeProvider>
      </FilesProvider>
    </UploadsProvider>
  );
}
