import { XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function NotVerified() {
  const session = useSession();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!session.data?.user.isVerified) setShow(true);
  }, []);

  if (show)
    return (
      <div className="flex w-full items-center justify-center bg-orange-400 py-1">
        <p className="text-center text-gray-500">
          Please verify your email to access all features
        </p>
        <XIcon
          className="right-2 cursor-pointer text-gray-500 sm:absolute"
          onClick={() => setShow(false)}
        />
      </div>
    );
}
