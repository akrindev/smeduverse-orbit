"use client";

import { menuList } from "@/app/(authenticated)/components/menu-list";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function NavMain() {
	const pathname = usePathname();
	const router = useRouter();

	// Use the custom auth store instead of next-auth
	const { user, isAuthenticated } = useAuth();

	// change variant to default when the page is active
	// this will highlight the menu item
	function isActive(path: string) {
		return pathname.startsWith(path);
	}

	// filtered menu based on user roles
	const filteredMenu = menuList.filter((item) => {
		// check if item.roles has user roles
		if (!item.roles) return true;

		if (item.separator) return false;

		return (
			item.roles &&
			item.roles.some((role) => user?.roles?.map((r) => r.name).includes(role))
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
