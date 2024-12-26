"use client";

import Link from "next/link";
import Image from "next/image";

import Logo from "@/app/icon.png";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const session = useSession();
  const isAuthenticated = session?.status === "authenticated";

  return (
    <nav className="z-50 flex items-center justify-between bg-white p-4 shadow-xl">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={Logo} alt="UploadX Logo" width={32} height={32} />
        <span className="text-xl font-bold">UploadX</span>
      </Link>
      <div className="hidden md:mr-2 md:block">
        {session.status === "loading" ? (
          <div className="cursor-pointer rounded border-2 border-gray-500 px-4 py-2 text-black">
            <Loader2 className="h-4 w-4 animate-spin rounded-full" />
          </div>
        ) : isAuthenticated ? (
          <div className="space-x-4">
            <div
              className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={async () => {
                document.cookie =
                  "img_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                await signOut();
              }}
            >
              Logout
            </div>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
