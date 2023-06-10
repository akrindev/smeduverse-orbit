// bottom navbar component
// the bottom navbar is only visible on mobile devices
// it is used to navigate between the different pages
// menu items are the same as in the sidebar
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  IconGridPattern,
  IconMicrophone,
  IconPlayerPlay,
  IconReportAnalytics,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export function BottomNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  // change variant to default when the page is active
  // this will highlight the menu item
  function isActive(path) {
    return pathname.startsWith(path) ? "default" : "ghost";
  }
  return (
    <div
      className={cn(
        "fixed lg:hidden bottom-0 w-full bg-background z-30",
        className
      )}
    >
      <Separator />
      <div className="flex justify-around py-4 px-2 space-x-2">
        <Button
          variant={isActive("/dashboard")}
          size="sm"
          className="w-full justify-center"
        >
          <IconPlayerPlay className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button
          variant={isActive("/modul")}
          size="sm"
          className="w-full justify-center"
        >
          <IconGridPattern className="mr-2 h-4 w-4" />
          Modul
        </Button>
        <Button
          variant={isActive("/rekap")}
          size="sm"
          className="w-full justify-center"
        >
          <IconReportAnalytics className="mr-2 h-4 w-4" />
          Rekap
        </Button>
      </div>
    </div>
  );
}
