"use client";

import { getSession } from "next-auth/react";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    (async () => {
      const session = await getSession();
      console.log(session);
    })();
  }, []);

  return <div>a</div>;
}
