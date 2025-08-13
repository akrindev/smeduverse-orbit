"use client";

import { Calendar, Clock, PartyPopper, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SplitText from "@/components/ui/SplitText/SplitText";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { menuList } from "../components/menu-list";
import ModulList from "../modul/components/modul-list";

// revalidate every 5 seconds
// export const revalidate = 5;

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Halaman utama",
// };

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
		// If authentication is already determined and user is not authenticated, redirect to login
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
			return;
		}

		if (!authLoading && isAuthenticated) {
			setIsLoading(false);
		}

		// No need to call requireAuth() here as it can cause redirect loops
		// Just check the authenticated state from the store
	}, [isAuthenticated, authLoading, router]);

	// console.log(analyticsData);
	const filteredMenu = menuList.filter((item) => {
		if (item.name === "Dashboard") return false;
		// check if item.roles has user roles
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
				<div className="relative bg-gradient-to-r from-blue-100 dark:from-blue-950/20 to-indigo-100 dark:to-indigo-950/20 mb-6 p-4 border border-blue-100 dark:border-blue-900/30 rounded-lg overflow-hidden">
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
						<div className="flex-shrink-0">
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
								{/* Small confetti near avatar */}
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

				<div className="flex justify-between items-center">
					<div className="space-y-1">
						<h2 className="font-semibold text-2xl tracking-tight">
							Quick Menu
						</h2>
						<p className="text-muted-foreground text-sm">
							Akses cepat ke fitur-fitur utama
						</p>
					</div>
				</div>

				<div className="gap-4 grid grid-cols-2 lg:grid-cols-4 mt-5">
					{filteredMenu.map((item) => (
						<Link href={item.path} key={item.name}>
							<Card className="shadow-md h-full duration-500 cursor-pointer hover:scale-105">
								<CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
									{/* <CardTitle className="font-medium text-sm">
                    {item.name}
                  </CardTitle> */}
									<item.icon className="w-4 h-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="font-bold text-md">{item.name}</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>

				<div className="mt-5">
					<div className="space-y-1 mt-6">
						<h2 className="font-semibold text-2xl tracking-tight">Modul</h2>
						<p className="text-muted-foreground text-sm">
							Modul yang Anda kelola
						</p>
					</div>
					<Separator className="my-4" />
					<ModulList owned />
				</div>
			</div>
		</div>
	);
}
