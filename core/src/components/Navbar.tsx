import Image from "next/image";
import Link from "next/link";

import Logo from "@/app/icon.png";
import { auth } from "@/auth";

import LogOutButton from "./ui/log-out";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="z-50 flex items-center justify-between bg-white p-4 shadow-xl">
      <Link href="/" className="flex items-center space-x-2">
        <Image src={Logo} alt="UploadX Logo" width={32} height={32} />
        <span className="text-xl font-bold">UploadX</span>
      </Link>
      <div className="hidden md:mr-2 md:block">
        {session ? (
          <div className="space-x-4">
            <LogOutButton />
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              Login
            </Link>
            <Link href="/register" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
