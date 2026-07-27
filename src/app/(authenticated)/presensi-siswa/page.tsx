"use client";

import { CalendarCheck, History, QrCode, Settings, ShieldCheck, UserCheck, Users } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLatestApelAttendanceQuery, useOrbitSettingQuery } from "@/queries/useApelAttendanceQuery";

export default function PresensiSiswaHubPage() {
	const todayDate = new Date().toISOString().split("T")[0];
	const { data: latestData, isLoading: isLatestLoading } = useLatestApelAttendanceQuery({ date: todayDate });
	const { data: startTimeSetting } = useOrbitSettingQuery("apel_time_start");

	const totalAttended = latestData?.attendances?.total ?? 0;
	const attendancesList = latestData?.attendances?.data ?? [];

	const quickCards = [
		{
			title: "Scan / Tap RFID",
			description: "Pencatatan presensi siswa via QR Code atau Kartu RFID",
			href: "/presensi-siswa/scan",
			icon: QrCode,
			color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
		},
		{
			title: "Presensi Harian",
			description: "Lihat dan kelola daftar presensi siswa hari ini atau tanggal terpilih",
			href: "/presensi-siswa/harian",
			icon: UserCheck,
			color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
		},
		{
			title: "Rekap Bulanan",
			description: "Lihat laporan matriks kehadiran bulanan siswa per rombongan belajar",
			href: "/presensi-siswa/rekap",
			icon: CalendarCheck,
			color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
		},
		{
			title: "Riwayat Siswa",
			description: "Cari dan tampilkan histori presensi individu siswa",
			href: "/presensi-siswa/riwayat",
			icon: History,
			color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
		},
		{
			title: "Pengaturan Apel",
			description: "Atur jadwal dan jam mulai pelaksanaan apel siswa",
			href: "/presensi-siswa/pengaturan",
			icon: Settings,
			color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800",
		},
	];

	return (
		<div className="space-y-6">
			{/* Metric Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-medium text-sm">Total Hadir Hari Ini</CardTitle>
						<Users className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						{isLatestLoading ? (
							<Skeleton className="w-20 h-8" />
						) : (
							<div className="font-bold text-3xl">{totalAttended} Siswa</div>
						)}
						<p className="mt-1 text-muted-foreground text-xs">Tercatat pada data apel hari ini</p>
					</CardContent>
				</Card>

				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-medium text-sm">Jam Mulai Apel</CardTitle>
						<ShieldCheck className="w-4 h-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-3xl">
							{startTimeSetting?.value ? String(startTimeSetting.value) : "07:00"} WIB
						</div>
						<p className="mt-1 text-muted-foreground text-xs">Batas waktu presensi apel pagi</p>
					</CardContent>
				</Card>

				<Card className="shadow-xs">
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="font-medium text-sm">Status Pemindai</CardTitle>
						<QrCode className="w-4 h-4 text-emerald-500" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-emerald-600 text-3xl dark:text-emerald-400">Siap Scan</div>
						<p className="mt-1 text-muted-foreground text-xs">Mendukung RFID USB & QR Code Camera</p>
					</CardContent>
				</Card>
			</div>

			{/* Feature Cards Grid */}
			<div className="space-y-3">
				<h2 className="font-semibold text-lg">Pilih Fitur Presensi</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{quickCards.map((card) => {
						const Icon = card.icon;
						return (
							<Link key={card.href} href={card.href}>
								<Card className="hover:shadow-md transition-all h-full cursor-pointer group hover:-translate-y-0.5">
									<CardHeader className="pb-3">
										<div className="flex items-center gap-3">
											<div className={`p-2.5 rounded-lg border ${card.color}`}>
												<Icon className="w-5 h-5" />
											</div>
											<CardTitle className="group-hover:text-primary transition-colors text-base">
												{card.title}
											</CardTitle>
										</div>
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

			{/* Recent Attendance Preview */}
			<Card className="shadow-xs">
				<CardHeader>
					<CardTitle className="text-base">Presensi Terakhir Hari Ini</CardTitle>
					<CardDescription>Daftar siswa yang baru saja melakukan scan presensi apel</CardDescription>
				</CardHeader>
				<CardContent>
					{isLatestLoading ? (
						<div className="space-y-2">
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
						</div>
					) : attendancesList.length === 0 ? (
						<div className="py-6 text-center text-muted-foreground text-sm">
							Belum ada data presensi apel yang dicatat hari ini.
						</div>
					) : (
						<div className="divide-y border rounded-md">
							{attendancesList.slice(0, 5).map((att) => (
								<div key={att.id} className="flex items-center justify-between p-3 text-sm">
									<div>
										<p className="font-medium">{att.student?.fullname || att.student_id}</p>
										<p className="text-muted-foreground text-xs">
											NIS: {att.student?.nipd || "-"} | Rombel: {att.rombel?.nama || "-"}
										</p>
									</div>
									<div className="text-right">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-emerald-800 text-xs bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
											Hadir
										</span>
										<p className="text-muted-foreground text-xs mt-0.5">
											{new Date(att.attendance_date).toLocaleTimeString("id-ID", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
