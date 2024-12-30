"use client";

import { signOut } from "next-auth/react";

export default function LogOutButton() {
  return (
    <div
      className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      onClick={async () => {
        document.cookie = "img_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await signOut();
      }}
    >
      Logout
    </div>
  );
}
