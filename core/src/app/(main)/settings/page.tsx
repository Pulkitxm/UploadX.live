"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_ITEMS } from "@/lib/config";

export default function SettingsPage() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {SETTINGS_ITEMS.map(
          ({ component: Component, show }, index) =>
            show && <Component key={index} />
        )}
      </div>
    </ScrollArea>
  );
}
