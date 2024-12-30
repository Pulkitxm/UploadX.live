"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import { useState } from "react";

export default function NotVerified({ session }: { session: Session }) {
  const [show, setShow] = useState(session && !session.user.isVerified);

  if (show)
    return (
      <div className="flex w-full bg-orange-400">
        <Link href="/verify-email" className="z-0 flex-grow items-center justify-center py-1">
          <p className="text-center text-gray-500">Please verify your email to access all features</p>
        </Link>
        <div className="flex w-8 items-center justify-center">
          <XIcon className="cursor-pointer text-gray-500 sm:absolute" onClick={() => setShow(false)} />
        </div>
      </div>
    );
}
