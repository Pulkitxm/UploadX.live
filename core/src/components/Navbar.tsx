"use client";

import Link from "next/link";
import Image from "next/image";

import Logo from "@/app/icon.png";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const session = useSession();
  const isAuthenticated = session?.status === "authenticated";
  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow-md">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={Logo} alt="UploadX Logo" width={32} height={32} />
        <span className="text-xl font-bold">UploadX</span>
      </Link>
      {isAuthenticated ? (
        <div className="space-x-4">
          <div
            className="cursor-pointer rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            onClick={() => {
              signOut();
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
    </nav>
  );
}
