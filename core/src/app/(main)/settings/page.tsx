"use client";

import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_ITEMS } from "@/lib/config";

export default function SettingsPage() {
  const session = useSession();
  if (!session.data?.user)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 size={30} className="animate-spin" />
      </div>
    );

  const settingsShownItems = SETTINGS_ITEMS(session.data?.user?.loginType);
  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {settingsShownItems.map(({ component: Component, show }, index) => show && <Component key={index} />)}
      </div>
    </ScrollArea>
  );
}
