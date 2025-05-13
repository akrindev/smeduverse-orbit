"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { menuList } from "@/app/(authenticated)/components/menu-list";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavMain() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
  });

  // change variant to default when the page is active
  // this will highlight the menu item
  function isActive(path) {
    return pathname.startsWith(path);
  }

  // filtered menu based on user roles
  const filteredMenu = menuList.filter((item) => {
    // check if item.roles has session user roles

    if (!item.roles) return true;

    if (item.separator) return false;

    return (
      item.roles &&
      item.roles.some((role) =>
        session?.user?.roles?.map((r) => r.name).includes(role)
      )
    );
  });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {filteredMenu.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={isActive(item.path)}>
              <Link href={item.path}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
