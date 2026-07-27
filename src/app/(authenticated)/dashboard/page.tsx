"use client";

import { Calendar, PartyPopper, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SplitText from "@/components/ui/SplitText/SplitText";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { menuList } from "../components/menu-list";
import KelasAjarList from "../kelas-ajar/components/kelas-ajar-list";

const iconColors: Record<string, string> = {
	"Kelas Ajar": "text-blue-500",
	"Monitoring": "text-emerald-500",
	"Presensi Siswa": "text-amber-500",
	"Jurnal Guru": "text-violet-500",
	"Jurnal Kelas": "text-indigo-500",
	"Rekap Laporan": "text-rose-500",
	"Rekap Kehadiran Bulanan": "text-teal-500",
	"Semester": "text-cyan-500",
	"Jadwal Jam Pelajaran": "text-orange-500",
	"Mata Pelajaran": "text-purple-500",
};

export default function Page() {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading, user } = useAuthQuery();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [currentTime] = useState<Date>(new Date());

	// Format date and time
	const formatDate = (date: Date) => {
		return date.toLocaleDateString("id-ID", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Ensure user is authenticated
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (!authLoading && isAuthenticated) {
			setIsLoading(false);
		}
	}, [isAuthenticated, authLoading, router]);

	const filteredMenu = menuList.filter((item) => {
		if (item.name === "Dashboard") return false;
		if (!item.roles) return true;
		if (item.separator) return false;

		return item.roles?.some((role) =>
			user?.roles?.map((r) => r.name).includes(role),
		);
	});

	if (authLoading || isLoading) {
		return (
			<div className="flex flex-col space-y-5 h-full">
				<Skeleton className="w-[250px] h-4" />
				<Skeleton className="w-[350px] h-4" />
				<Skeleton className="w-[350px] h-4" />
			</div>
		);
	}

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				{/* Welcome Section */}
				<div className="relative bg-linear-to-r from-blue-100 dark:from-blue-950/20 to-indigo-100 dark:to-indigo-950/20 mb-6 p-4 border border-blue-100 dark:border-blue-900/30 rounded-lg overflow-hidden">
					{/* Confetti Icons */}
					<div className="top-2 right-2 absolute flex space-x-1">
						<PartyPopper className="w-5 h-5 text-yellow-500 animate-bounce" />
						<Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
						<Sparkles
							className="w-3 h-3 text-blue-400 animate-bounce"
							style={{ animationDelay: "0.5s" }}
						/>
					</div>

					<div className="flex items-center space-x-4">
						<div className="shrink-0">
							<div className="relative">
								<Avatar className="border-2 border-blue-200 dark:border-blue-800 w-12 h-12">
									<AvatarImage
										src={user?.teacher?.photo}
										alt={user?.teacher?.fullname || "User"}
									/>
									<AvatarFallback className="bg-blue-100 dark:bg-blue-900/30 font-semibold text-blue-600 text-lg dark:text-blue-400">
										{user?.teacher?.fullname?.charAt(0) || "U"}
									</AvatarFallback>
								</Avatar>
								<Sparkles className="-top-1 -right-1 absolute w-3 h-3 text-yellow-400 animate-pulse" />
							</div>
						</div>
						<div className="flex flex-col space-y-2">
							<SplitText
								text={`Selamat datang kembali, ${user?.teacher?.fullname || "Guru"}!`}
								className="font-bold text-gray-900 text-xl dark:text-gray-100"
								splitType="words"
								delay={150}
								duration={0.8}
								ease="power3.out"
								from={{ opacity: 0, y: 30 }}
								to={{ opacity: 1, y: 0 }}
								threshold={0.1}
								rootMargin="-50px"
							/>

							{/* Date and Time */}
							<div className="flex items-center space-x-4 text-gray-600 text-sm dark:text-gray-400">
								<div className="flex items-center space-x-1">
									<Calendar className="w-4 h-4" />
									<span>{formatDate(currentTime)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Quick Menu Header */}
				<div className="flex justify-between items-center mb-1">
					<div className="space-y-1">
						<h2 className="font-semibold text-2xl tracking-tight">
							Quick Menu
						</h2>
						<p className="text-muted-foreground text-sm">
							Akses cepat ke fitur-fitur utama
						</p>
					</div>
				</div>

				{/* Pure Icon Grid (No Card, No Icon Background Wrapper) */}
				<div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 py-3">
					{filteredMenu.map((item) => {
						const textColor = iconColors[item.name] || "text-primary";
						const IconComponent = item.icon;

						return (
							<Link
								href={item.path}
								key={item.name}
								className="group flex flex-col items-center text-center cursor-pointer p-1 transition-transform duration-200 hover:scale-105"
							>
								<IconComponent className={`w-8 h-8 sm:w-9 sm:h-9 ${textColor} mb-2 group-hover:scale-110 transition-transform duration-200 stroke-[1.8]`} />
								<span className="text-xs font-medium text-foreground/85 group-hover:text-primary transition-colors leading-tight text-center line-clamp-2">
									{item.name}
								</span>
							</Link>
						);
					})}
				</div>

				<div className="mt-6">
					<div className="space-y-1 mt-4">
						<h2 className="font-semibold text-2xl tracking-tight">Kelas Ajar</h2>
						<p className="text-muted-foreground text-sm">
							Kelas ajar yang Anda kelola
						</p>
					</div>
					<Separator className="my-4" />
					<KelasAjarList owned />
				</div>
			</div>
		</div>
	);
}
