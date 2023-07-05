"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { menuList } from "./menu-list";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

export function Sidebar({ className }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
  });

  // change variant to default when the page is active
  // this will highlight the menu item
  function isActive(path) {
    return pathname.startsWith(path) ? "default" : "ghost";
  }

  // filtered menu based on user roles
  const filteredMenu = menuList.filter((item) => {
    // check if item.roles has session user roles

    if (!item.roles) return true;

    return (
      item.roles &&
      item.roles.some((role) =>
        session?.user?.roles?.map((r) => r.name).includes(role)
      )
    );
  });

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            {filteredMenu.map((item) =>
              item.separator === true ? (
                <div className="py-2" key={item.path}>
                  <Separator className="my-2" />
                </div>
              ) : (
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
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
