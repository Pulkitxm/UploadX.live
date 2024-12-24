"use client";

import Link from "next/link";
import { Home, Settings, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const menuItems = [{ icon: Home, label: "Dashboard", href: "/" }];

function SidebarContent() {
  return (
    <div className="flex h-full w-full flex-col space-y-2 py-5">
      {menuItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex items-center space-x-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
        >
          <item.icon className="h-5 w-5" />
          <span className="font-medium">{item.label}</span>
        </Link>
      ))}
      <div className="flex-grow"></div>
      <Link
        href={"/settings"}
        className="flex items-center space-x-3 rounded-lg p-3 text-gray-700 transition-all duration-200 hover:bg-primary/10 hover:text-primary"
      >
        <Settings className="h-5 w-5" />
        <span className="font-medium">Settings</span>
      </Link>
    </div>
  );
}

export default function Sidebar() {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-20 z-30 lg:hidden"
          >
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
