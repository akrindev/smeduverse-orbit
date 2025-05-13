"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  // Close sidebar when route changes (only on mobile)
  React.useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, setOpenMobile, isMobile]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href={"/"} className="p-3 cursor-pointer">
          <div className={cn("flex items-center")}>
            <Image
              src="/orbit.png"
              width={30}
              height={30}
              alt="Smeduverse Orbit"
            />
            <span className="group-data-[state=collapsed]:sr-only ml-2 lg:ml-5 font-bold text-xl">
              Smeduverse Orbit
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
