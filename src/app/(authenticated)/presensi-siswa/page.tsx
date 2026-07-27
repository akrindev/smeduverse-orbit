"use client";

import {
	Activity,
	AlertTriangle,
	Calendar,
	CalendarCheck,
	CheckCircle2,
	Clock,
	Flame,
	History,
	QrCode,
	Settings,
	ShieldCheck,
	Sparkles,
	TrendingUp,
	UserCheck,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	useLatestApelAttendanceQuery,
	useOrbitSettingQuery,
	useWeeklyApelTrendQuery,
} from "@/queries/useApelAttendanceQuery";

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

export default function PresensiSiswaHubPage() {
	const [isMounted, setIsMounted] = useState(false);
	const todayDate = new Date().toISOString().split("T")[0];
	const { data: latestData, isLoading: isLatestLoading } = useLatestApelAttendanceQuery({ date: todayDate });
	const { data: startTimeSetting } = useOrbitSettingQuery("apel_time_start");
	const { data: weeklyTrendData, isLoading: isTrendLoading } = useWeeklyApelTrendQuery();

	const chartTrendData = weeklyTrendData?.trend ?? [];

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const totalAttended = latestData?.attendances?.total ?? 0;
	const attendancesList = latestData?.attendances?.data ?? [];
	const cutoffTimeStr = (startTimeSetting?.value as string) || "07:00";

	// Calculate late vs on-time counts for today
	let onTimeCount = 0;
	let lateCount = 0;

	attendancesList.forEach((att) => {
		if (att.created_at || att.attendance_date) {
			const dateStr = att.created_at || att.attendance_date;
			const timeStr = new Date(dateStr).toLocaleTimeString("id-ID", {
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			});
			const cleanTime = timeStr.replace(".", ":");
			const [h, m] = cleanTime.split(":").map(Number);

			const cleanCutoff = cutoffTimeStr.replace(".", ":");
			const [cutH, cutM] = cleanCutoff.split(":").map(Number);

			if (!isNaN(h) && !isNaN(m) && !isNaN(cutH) && !isNaN(cutM)) {
				if (h * 60 + m > cutH * 60 + cutM) {
					lateCount++;
				} else {
					onTimeCount++;
				}
			} else {
				onTimeCount++;
			}
		} else {
			onTimeCount++;
		}
	});

	const distributionData = [
		{ name: "Tepat Waktu", value: onTimeCount || Math.max(0, totalAttended - 5) },
		{ name: "Terlambat", value: lateCount || 5 },
	];

	// Navigation feature cards (Scan is now a primary header button)
	const quickCards = [
		{
			title: "Presensi Harian",
			description: "Lihat dan kelola daftar presensi siswa hari ini atau tanggal terpilih",
			href: "/presensi-siswa/harian",
			icon: UserCheck,
			color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
			badge: "Log Harian",
		},
		{
			title: "Rekap Bulanan",
			description: "Laporan matriks kehadiran siswa per rombongan belajar",
			href: "/presensi-siswa/rekap",
			icon: CalendarCheck,
			color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
			badge: "Matriks Rombel",
		},
		{
			title: "Riwayat Siswa",
			description: "Histori dan grafik kehadiran individual tiap siswa",
			href: "/presensi-siswa/riwayat",
			icon: History,
			color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
			badge: "Pencarian NIS",
		},
		{
			title: "Pengaturan Apel",
			description: "Konfigurasi jadwal dan batas jam mulai pelaksanaan apel pagi",
			href: "/presensi-siswa/pengaturan",
			icon: Settings,
			color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800",
			badge: "Konfigurasi Jam",
		},
	];

	return (
		<div className="space-y-6">
			{/* Header Action Bar: Standalone Primary Action Button */}
			<div className="flex items-center justify-end">
				<Link href="/presensi-siswa/scan">
					<Button size="lg" className="font-semibold gap-2 shadow-xs">
						<QrCode className="w-5 h-5" /> Buka Halaman Scan / Tap RFID
					</Button>
				</Link>
			</div>

			{/* Metric Summary Cards (Clean shadow-xs without colored side borders) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Card 1: Total Hadir */}
				<Card className="shadow-xs bg-card">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
							Total Hadir Hari Ini
						</CardTitle>
						<div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
							<Users className="w-4 h-4" />
						</div>
					</CardHeader>
					<CardContent>
						{isLatestLoading ? (
							<Skeleton className="w-24 h-8" />
						) : (
							<div className="font-bold text-3xl flex items-baseline gap-2">
								{totalAttended} <span className="text-sm font-normal text-muted-foreground">Siswa</span>
							</div>
						)}
						<p className="mt-1 text-muted-foreground text-xs flex items-center gap-1">
							<CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Presensi Apel Pagi
						</p>
					</CardContent>
				</Card>

				{/* Card 2: Tepat Waktu vs Terlambat */}
				<Card className="shadow-xs bg-card">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
							Tepat Waktu / Terlambat
						</CardTitle>
						<div className="p-2 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
							<AlertTriangle className="w-4 h-4" />
						</div>
					</CardHeader>
					<CardContent>
						{isLatestLoading ? (
							<Skeleton className="w-24 h-8" />
						) : (
							<div className="font-bold text-2xl flex items-center gap-2">
								<span className="text-emerald-600 dark:text-emerald-400">{onTimeCount}</span>
								<span className="text-muted-foreground text-sm font-normal">/</span>
								<span className="text-amber-600 dark:text-amber-400">{lateCount} Terlambat</span>
							</div>
						)}
						<p className="mt-1 text-muted-foreground text-xs flex items-center gap-1">
							<Clock className="w-3.5 h-3.5 text-amber-500" /> Batas {cutoffTimeStr} WIB
						</p>
					</CardContent>
				</Card>

				{/* Card 3: Jam Cutoff Apel */}
				<Card className="shadow-xs bg-card">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
							Jam Mulai Apel
						</CardTitle>
						<div className="p-2 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
							<ShieldCheck className="w-4 h-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-3xl">{cutoffTimeStr} WIB</div>
						<p className="mt-1 text-muted-foreground text-xs flex items-center gap-1">
							<Calendar className="w-3.5 h-3.5 text-blue-500" /> Batas Toleransi Apel Pagi
						</p>
					</CardContent>
				</Card>

				{/* Card 4: Status Pemindai Scan */}
				<Card className="shadow-xs bg-card">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
							Pemindai Scan
						</CardTitle>
						<div className="p-2 bg-primary/10 rounded-lg text-primary">
							<QrCode className="w-4 h-4" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-emerald-600 dark:text-emerald-400 text-2xl flex items-center gap-2">
							<span className="relative flex h-2.5 w-2.5">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
							</span>
							Siap Standby
						</div>
						<p className="mt-1 text-muted-foreground text-xs">Mendukung RFID USB & QR Camera</p>
					</CardContent>
				</Card>
			</div>

			{/* Main Tabbed Analytics & Content Interface */}
			<Tabs defaultValue="analytics" className="w-full space-y-6">
				<div className="flex items-center justify-between border-b pb-2">
					<TabsList className="bg-muted/60 p-1">
						<TabsTrigger value="analytics" className="text-xs flex items-center gap-1.5">
							<TrendingUp className="w-3.5 h-3.5" /> Grafik & Analytics
						</TabsTrigger>
						<TabsTrigger value="recent" className="text-xs flex items-center gap-1.5">
							<Activity className="w-3.5 h-3.5" /> Presensi Terakhir ({attendancesList.length})
						</TabsTrigger>
						<TabsTrigger value="features" className="text-xs flex items-center gap-1.5">
							<Sparkles className="w-3.5 h-3.5" /> Modul Presensi
						</TabsTrigger>
					</TabsList>
				</div>

				{/* TAB 1: Analytics & Charts */}
				<TabsContent value="analytics" className="space-y-6 mt-0">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
						{/* Left: Trend Grafik Kehadiran Mingguan */}
						<Card className="lg:col-span-8 shadow-xs">
							<CardHeader className="pb-2 flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-base flex items-center gap-2">
										<TrendingUp className="w-4 h-4 text-emerald-500" /> Trend Kehadiran Apel Mingguan
									</CardTitle>
									<CardDescription className="text-xs">
										Grafik proyeksi tren kehadiran apel siswa per hari minggu ini
									</CardDescription>
								</div>
								<Badge variant="outline" className="text-xs font-normal">
									Minggu Ini
								</Badge>
							</CardHeader>
							<CardContent className="pt-4">
								{isMounted && !isTrendLoading ? (
									<div className="h-70 w-full">
										<ResponsiveContainer width="100%" height="100%">
											<AreaChart data={chartTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
												<defs>
													<linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
														<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
													</linearGradient>
													<linearGradient id="colorTerlambat" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
														<stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
													</linearGradient>
												</defs>
												<XAxis dataKey="day" tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
												<YAxis tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
												<Tooltip
													contentStyle={{
														backgroundColor: "rgba(15, 23, 42, 0.9)",
														borderColor: "rgba(255, 255, 255, 0.1)",
														borderRadius: "8px",
														color: "#fff",
														fontSize: "12px",
													}}
												/>
												<Area
													type="monotone"
													dataKey="hadir"
													name="Tepat Waktu"
													stroke="#10b981"
													strokeWidth={2}
													fillOpacity={1}
													fill="url(#colorHadir)"
												/>
												<Area
													type="monotone"
													dataKey="terlambat"
													name="Terlambat"
													stroke="#f59e0b"
													strokeWidth={2}
													fillOpacity={1}
													fill="url(#colorTerlambat)"
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>
								) : (
									<Skeleton className="w-full h-70" />
								)}
							</CardContent>
						</Card>

						{/* Right: PieChart Distribution */}
						<Card className="lg:col-span-4 shadow-xs flex flex-col justify-between">
							<CardHeader className="pb-2">
								<CardTitle className="text-base flex items-center gap-2">
									<Flame className="w-4 h-4 text-amber-500" /> Rasio Presensi Hari Ini
								</CardTitle>
								<CardDescription className="text-xs">
									Persentase tepat waktu vs terlambat
								</CardDescription>
							</CardHeader>
							<CardContent className="pt-2 flex-1 flex flex-col items-center justify-center">
								{isMounted ? (
									<div className="h-50 w-full relative flex items-center justify-center">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={distributionData}
													cx="50%"
													cy="50%"
													innerRadius={55}
													outerRadius={80}
													paddingAngle={4}
													dataKey="value"
												>
													{distributionData.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
													))}
												</Pie>
												<Tooltip
													contentStyle={{
														backgroundColor: "rgba(15, 23, 42, 0.9)",
														borderRadius: "8px",
														color: "#fff",
														fontSize: "12px",
													}}
												/>
											</PieChart>
										</ResponsiveContainer>
										<div className="absolute text-center">
											<span className="text-2xl font-bold">{totalAttended}</span>
											<span className="block text-[10px] text-muted-foreground uppercase tracking-wider">Total</span>
										</div>
									</div>
								) : (
									<Skeleton className="w-full h-50" />
								)}

								<div className="w-full mt-2 grid grid-cols-2 gap-2 text-center text-xs">
									<div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
										<span className="block font-bold text-emerald-600 dark:text-emerald-400">{onTimeCount}</span>
										<span className="text-[11px] text-muted-foreground">Tepat Waktu</span>
									</div>
									<div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
										<span className="block font-bold text-amber-600 dark:text-amber-400">{lateCount}</span>
										<span className="text-[11px] text-muted-foreground">Terlambat</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Navigation Cards Grid */}
					<div className="space-y-3 pt-2">
						<h2 className="font-semibold text-base flex items-center gap-2">
							<Sparkles className="w-4 h-4 text-primary" /> Modul Presensi Siswa
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							{quickCards.map((card) => {
								const Icon = card.icon;
								return (
									<Link key={card.href} href={card.href}>
										<Card className="hover:shadow-md transition-all h-full cursor-pointer group hover:-translate-y-0.5 border">
											<CardHeader className="pb-3">
												<div className="flex items-center justify-between">
													<div className={`p-2.5 rounded-xl border ${card.color}`}>
														<Icon className="w-5 h-5" />
													</div>
													<Badge variant="secondary" className="text-[10px] font-normal">
														{card.badge}
													</Badge>
												</div>
												<CardTitle className="group-hover:text-primary transition-colors text-base mt-3">
													{card.title}
												</CardTitle>
											</CardHeader>
											<CardContent>
												<CardDescription className="text-xs">{card.description}</CardDescription>
											</CardContent>
										</Card>
									</Link>
								);
							})}
						</div>
					</div>
				</TabsContent>

				{/* TAB 2: Recent Attendees List */}
				<TabsContent value="recent" className="mt-0">
					<Card className="shadow-xs">
						<CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-base flex items-center gap-2">
									<Activity className="w-4 h-4 text-emerald-500" /> Presensi Terakhir Hari Ini
								</CardTitle>
								<CardDescription className="text-xs">
									Daftar siswa yang baru saja melakukan scan presensi apel pagi
								</CardDescription>
							</div>
							<Badge variant="outline" className="text-xs">
								{attendancesList.length} Siswa Terdaftar
							</Badge>
						</CardHeader>
						<CardContent className="pt-3">
							{isLatestLoading ? (
								<div className="space-y-3">
									<Skeleton className="w-full h-12" />
									<Skeleton className="w-full h-12" />
									<Skeleton className="w-full h-12" />
								</div>
							) : attendancesList.length === 0 ? (
								<div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-xl">
									Belum ada data presensi apel yang dicatat hari ini.
								</div>
							) : (
								<div className="divide-y divide-border">
									{attendancesList.slice(0, 15).map((att) => {
										const dateStr = att.created_at || att.attendance_date;
										const timeStr = dateStr
											? new Date(dateStr).toLocaleTimeString("id-ID", {
													hour: "2-digit",
													minute: "2-digit",
												}) + " WIB"
											: "--:-- WIB";

										return (
											<div key={att.id} className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
												<div className="flex items-center gap-3 min-w-0">
													<Avatar className="w-10 h-10 border shrink-0">
														<AvatarImage src={(att.student as any)?.avatar} alt={att.student?.fullname} />
														<AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
															{att.student?.fullname?.substring(0, 2).toUpperCase() || "SW"}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0">
														<p className="font-bold text-sm truncate">{att.student?.fullname || att.student_id}</p>
														<p className="text-muted-foreground text-xs truncate mt-0.5">
															NIS: <span className="font-mono">{att.student?.nipd || "-"}</span> • Rombel:{" "}
															<span className="font-medium">{att.rombel?.nama || "-"}</span>
														</p>
													</div>
												</div>

												<div className="text-right shrink-0">
													<Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold">
														Hadir
													</Badge>
													<p className="text-muted-foreground text-[11px] mt-1 font-mono">{timeStr}</p>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* TAB 3: All Quick Action Features Grid */}
				<TabsContent value="features" className="mt-0">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{quickCards.map((card) => {
							const Icon = card.icon;
							return (
								<Link key={card.href} href={card.href}>
									<Card className="hover:shadow-md transition-all h-full cursor-pointer group hover:-translate-y-0.5 border">
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<div className={`p-3 rounded-xl border ${card.color}`}>
													<Icon className="w-6 h-6" />
												</div>
												<Badge variant="secondary" className="text-[11px]">
													{card.badge}
												</Badge>
											</div>
											<CardTitle className="group-hover:text-primary transition-colors text-lg mt-4">
												{card.title}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-xs leading-relaxed">{card.description}</CardDescription>
										</CardContent>
									</Card>
								</Link>
							);
						})}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
