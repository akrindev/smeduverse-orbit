"use client";

import * as React from "react";

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
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, status } = useSession();

  // if unauthenticated
  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <Link href={"/"} className='p-3 cursor-pointer'>
          <div className={cn("flex items-center")}>
            <Image
              src='/orbit.png'
              width={30}
              height={30}
              alt='Smeduverse Orbit'
            />
            <span className='group-data-[state=collapsed]:sr-only ml-2 lg:ml-5 font-bold text-xl'>
              Smeduverse Orbit
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        {status === "loading" ? (
          <div>Loading...</div>
        ) : (
          <NavUser user={data!.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
