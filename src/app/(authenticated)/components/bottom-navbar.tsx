// bottom navbar component
// the bottom navbar is only visible on mobile devices
// it is used to navigate between the different pages
// menu items are the same as in the sidebar
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { menuList } from "./menu-list";
import { useSession } from "next-auth/react";

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: string;
    role_id: number;
    model_type: string;
  };
}

export function BottomNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
  });

  if (!session) return null;

  // change variant to default when the page is active
  // this will highlight the menu item
  function isActive(path: string, bool = false) {
    const matched = pathname.startsWith(path);

    if (!bool) {
      return matched ? "default" : "ghost";
    }

    return matched;
  }

  // filtered menu based on user roles
  const filteredMenu = menuList.filter((item) => {
    // check if item.roles has session user roles
    if (!item.roles) return true;

    return item.roles.some((role) =>
      session.user?.roles?.map((r: Role) => r.name).includes(role)
    );
  });

  return (
    <div
      className={cn(
        "fixed lg:hidden bottom-0 w-full bg-background z-30",
        className
      )}
    >
      <Separator />
      <div className="flex justify-around space-x-2 px-2 py-4">
        {filteredMenu.map(
          (item) =>
            !item.separator && (
              <Button
                key={item.name}
                variant={isActive(item.path) as "default" | "ghost"}
                size="sm"
                className="justify-center w-full"
                onClick={() => router.push(item.path)}
              >
                <item.icon className="mr-2 w-4 h-4" />
                {isActive(item.path, true) && item.name}
              </Button>
            )
        )}
      </div>
    </div>
  );
}
