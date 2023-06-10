"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  IconGridPattern,
  IconListDetails,
  IconMusic,
  IconPlayerPlay,
  IconReportAnalytics,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";

export function Sidebar({ className }) {
  const pathname = usePathname();
  // change variant to default when the page is active
  // this will highlight the menu item
  function isActive(path) {
    return pathname.startsWith(path) ? "default" : "ghost";
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/dashboard")}
              size="sm"
              className="w-full justify-start"
            >
              <IconPlayerPlay className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={isActive("/modul")}
              size="sm"
              className="w-full justify-start"
            >
              <IconGridPattern className="mr-2 h-4 w-4" />
              Modul
            </Button>
            <Button
              variant={isActive("/rekap")}
              size="sm"
              className="w-full justify-start"
            >
              <IconReportAnalytics className="mr-2 h-4 w-4" />
              Rekap Laporan
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconListDetails className="mr-2 h-4 w-4" />
              Playlists
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconMusic className="mr-2 h-4 w-4" />
              Songs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
