"use client";

import { menuList } from "@/app/(authenticated)/components/menu-list";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavbar() {
	const pathname = usePathname();
	const { user } = useAuth();

	const filteredMenu = menuList.filter((item) => {
		if (item.separator) return false;
		if (!item.roles) return true;
		return (
			item.roles &&
			item.roles.some((role) => user?.roles?.map((r) => r.name).includes(role))
		);
	});

	// Define preferred items for mobile navbar to ensure important ones are visible
	// and to respect the user's request to replace "Modul" with "Rekap Kehadiran Bulanan"
	const preferredMobileItems = [
		{ name: "Dashboard", label: "Dashboard" },
		{ name: "Rekap Kehadiran Bulanan", label: "Bulanan" },
		{ name: "Monitoring", label: "Monitoring" },
		{ name: "Jurnal Guru", label: "Jurnal" },
		{ name: "Rekap Laporan", label: "Rekap" },
	];

	const mobileItems = preferredMobileItems
		.map((pref) => {
			const item = filteredMenu.find((m) => m.name === pref.name);
			if (!item) return null;
			return { ...item, displayName: pref.label };
		})
		.filter((item): item is NonNullable<typeof item> & { displayName: string } => item !== null);

	function isActive(path: string) {
		if (path === "/rekap") {
			return pathname === path;
		}
		return pathname.startsWith(path);
	}

	return (
		<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-4 py-2 pb-safe-area-inset-bottom">
			<nav className="flex items-center justify-around max-w-lg mx-auto">
				{mobileItems.map((item) => {
					const Icon = item.icon;
					const active = isActive(item.path);
					return (
						<Link
							key={item.name}
							href={item.path}
							className={cn(
								"flex flex-col items-center justify-center p-2 px-3 rounded-2xl transition-all duration-300 relative min-w-[68px]",
								active 
									? "bg-primary/10 text-primary shadow-xs" 
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							<Icon className={cn(
                                "size-6 transition-transform duration-300",
                                active && "stroke-[2.5px] scale-110"
                            )} />
							<span className="text-[10px] font-bold mt-1 truncate max-w-[64px]">
								{item.displayName}
							</span>
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
