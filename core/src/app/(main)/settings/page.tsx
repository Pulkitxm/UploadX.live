"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import PasswordChange from "@/components/Settings/PasswordChange";
import UserInfo from "@/components/Settings/UserInfo";
import LoginMethods from "@/components/Settings/LoginMethods";

export default function SettingsPage() {
  const things = [UserInfo, LoginMethods, PasswordChange];

  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {things.map((Thing, index) => (
          <Thing key={index} />
        ))}
      </div>
    </ScrollArea>
  );
}
