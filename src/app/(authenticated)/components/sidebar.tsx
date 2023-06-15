"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { IconBooks, IconListDetails } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { menuList } from "./menu-list";
import { Separator } from "@/components/ui/separator";

export function Sidebar({ className }) {
  const pathname = usePathname();
  const router = useRouter();
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
            {menuList.map((item) => (
              <Button
                key={item.name}
                variant={isActive(item.path)}
                size="sm"
                className="w-full justify-start"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          <Separator className="my-2" />
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconListDetails className="mr-2 h-4 w-4" />
              Semester
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <IconBooks className="mr-2 h-4 w-4" />
              Mata Pelajaran
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
