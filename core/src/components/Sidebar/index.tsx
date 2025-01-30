import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SIDEBAR_MENU_ITEMS } from "@/lib/config";
import { SIDEBAR_MENU_ITEM_TYPE } from "@/types/dash";

function SidebarContent() {
  const topItems = SIDEBAR_MENU_ITEMS.filter((item) => item.position === "top");
  const bottomItems = SIDEBAR_MENU_ITEMS.filter((item) => item.position === "bottom");
  return (
    <div className="flex h-full w-full flex-col space-y-2 px-2 py-5">
      <SettingsItems items={topItems} />
      <div className="flex-grow"></div>
      <SettingsItems items={bottomItems} />
    </div>
  );
}

function SettingsItems({ items }: { items: SIDEBAR_MENU_ITEM_TYPE[] }) {
  return items.map((item, index) => {
    const Container = item.href ? Link : "div";
    return (
      <Container
        key={index}
        href={item.href ?? ""}
        className={`flex items-center space-x-3 rounded-lg p-3 text-gray-700 transition-all duration-200 ${
          item.type === "ICON" ? "hover:bg-primary/10 hover:text-primary" : ""
        }`}
      >
        {item.type === "ICON" ? (
          <>
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </>
        ) : (
          <item.component />
        )}
      </Container>
    );
  });
}

export default function Sidebar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed left-4 top-20 z-30 lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden w-64 overflow-y-auto bg-white shadow-lg lg:block">
        <SidebarContent />
      </div>
    </>
  );
}
