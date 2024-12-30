import { auth } from "@/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SETTINGS_ITEMS } from "@/lib/config";

export default async function SettingsPage() {
  const session = await auth();
  const settingsShownItems = SETTINGS_ITEMS(session?.user.loginType);
  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto space-y-6 px-4 py-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        {settingsShownItems.map(({ component: Component, show }, index) => show && <Component key={index} />)}
      </div>
    </ScrollArea>
  );
}
