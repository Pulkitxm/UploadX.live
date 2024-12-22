"use client";

import { signOut } from "next-auth/react";
import React from "react";

export default function page() {
  const SignOut = async () => {
    await signOut();
  };
  return (
    <div>
      <button onClick={SignOut}>Sign out</button>
    </div>
  );
}
