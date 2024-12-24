"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Icons } from "./icons";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    teacher: {
      photo: string;
    };
  };
}) {
  const { isMobile } = useSidebar();

  const { theme, setTheme } = useTheme();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
              <Avatar className='rounded-lg w-8 h-8'>
                <AvatarImage src={user.teacher.photo} alt={user.name} />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='flex-1 grid text-left text-sm leading-tight'>
                <span className='font-semibold truncate'>{user.name}</span>
                <span className='text-xs truncate'>{user.email}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='rounded-lg w-[--radix-dropdown-menu-trigger-width] min-w-56'
            side={isMobile ? "bottom" : "right"}
            align='end'
            sideOffset={4}>
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='rounded-lg w-8 h-8'>
                  <AvatarImage src={user.teacher.photo} alt={user.name} />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='flex-1 grid text-left text-sm leading-tight'>
                  <span className='font-semibold truncate'>{user.name}</span>
                  <span className='text-xs truncate'>{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Icons.sun className='w-5 h-5 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0' />
              <Icons.moon className='absolute w-5 h-5 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100' />

              <span className='ml-3'>Tema</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              <span className='ml-3'>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
