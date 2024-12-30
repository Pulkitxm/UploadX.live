"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import {
  UploadManagerMinimizeProvider,
  UploadsProvider
} from "@/state/providers/uploadsProvider";

export default function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session: Session;
}) {
  useEffect(() => {
    try {
      if (!session?.user.img_token) return;
      const token = session.user.img_token;

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
  }, [session?.user.img_token]);

  return (
    <UploadsProvider>
      <UploadManagerMinimizeProvider>{children}</UploadManagerMinimizeProvider>
    </UploadsProvider>
  );
}
