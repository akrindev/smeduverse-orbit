"use client";

import { CalendarCheck, History, LayoutDashboard, QrCode, Records, Settings, UserCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
	{ name: "Overview", href: "/presensi-siswa", icon: LayoutDashboard },
	{ name: "Scan / Tap Presensi", href: "/presensi-siswa/scan", icon: QrCode },
	{ name: "Presensi Harian", href: "/presensi-siswa/harian", icon: UserCheck },
	{ name: "Rekap Bulanan", href: "/presensi-siswa/rekap", icon: CalendarCheck },
	{ name: "Riwayat Siswa", href: "/presensi-siswa/riwayat", icon: History },
	{ name: "Pengaturan", href: "/presensi-siswa/pengaturan", icon: Settings },
];

export default function PresensiSiswaLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === "/presensi-siswa") {
			return pathname === path;
		}
		return pathname.startsWith(path);
	};

	return (
		<div className="flex flex-col space-y-6 w-full h-full">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
				<div>
					<h1 className="font-bold text-2xl tracking-tight">Presensi Siswa (Apel)</h1>
					<p className="text-muted-foreground text-sm">
						Sistem pencatatan dan pengelolaan presensi apel harian siswa
					</p>
				</div>
			</div>

			{/* Sub Navigation Bar */}
			<div className="flex items-center gap-1 bg-muted/50 p-1 border rounded-lg overflow-x-auto">
				{navItems.map((item) => {
					const Icon = item.icon;
					const active = isActive(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
								active
									? "bg-background text-primary shadow-xs"
									: "text-muted-foreground hover:bg-background/50 hover:text-foreground"
							}`}
						>
							<Icon className="w-4 h-4" />
							<span>{item.name}</span>
						</Link>
					);
				})}
			</div>

			{/* Main Content Area */}
			<div className="flex-1 w-full">{children}</div>
		</div>
	);
}
