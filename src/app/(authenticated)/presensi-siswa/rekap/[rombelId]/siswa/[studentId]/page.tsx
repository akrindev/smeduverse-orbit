"use client";

import BaseLoading from "@/components/base-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMonthlyApelAttendanceQuery, useOrbitSettingQuery, useStudentApelHistoryQuery } from "@/queries/useApelAttendanceQuery";
import { useRombelsQuery } from "@/queries/useRombelQuery";
import { IconArrowLeft } from "@tabler/icons-react";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const monthsList = [
	{ value: 1, label: "Januari" },
	{ value: 2, label: "Februari" },
	{ value: 3, label: "Maret" },
	{ value: 4, label: "April" },
	{ value: 5, label: "Mei" },
	{ value: 6, label: "Juni" },
	{ value: 7, label: "Juli" },
	{ value: 8, label: "Agustus" },
	{ value: 9, label: "September" },
	{ value: 10, label: "Oktober" },
	{ value: 11, label: "November" },
	{ value: 12, label: "Desember" },
];

export default function PresensiSiswaRekapSiswaPage() {
	const params = useParams<{ rombelId: string; studentId: string }>();
	const rombelId = useMemo(() => params?.rombelId ?? "", [params]);
	const studentId = useMemo(() => params?.studentId ?? "", [params]);

	const searchParams = useSearchParams();
	const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
	const year = Number(searchParams.get("year")) || new Date().getFullYear();

	const { data: rombels } = useRombelsQuery();
	const selectedRombelObj = rombels?.find((r) => r.id === rombelId);

	const { data: monthlyData } = useMonthlyApelAttendanceQuery({
		rombel_id: rombelId,
		month,
		year,
	});

	const { data: studentHistoryData, isLoading: isStudentHistoryLoading } = useStudentApelHistoryQuery({
		student_id: studentId,
		month,
		year,
	});

	const { data: workdaysData } = useOrbitSettingQuery("apel_workdays_config");

	const parsedWorkdays = useMemo(() => {
		if (workdaysData?.value) {
			try {
				const parsed = JSON.parse(String(workdaysData.value));
				if (Array.isArray(parsed)) return parsed;
			} catch (_) {}
		}
		return null;
	}, [workdaysData]);

	// Calculate total effective working session days in month (excluding weekends/holidays set in settings)
	const effectiveSessionDays = useMemo(() => {
		const daysInMonth = new Date(year, month, 0).getDate();
		let count = 0;

		const holidayDaysOfWeek = new Set<number>();
		if (parsedWorkdays && parsedWorkdays.length > 0) {
			const keyToDayOfWeek: Record<string, number> = {
				minggu: 0,
				senin: 1,
				selasa: 2,
				rabu: 3,
				kamis: 4,
				jumat: 5,
				sabtu: 6,
			};
			parsedWorkdays.forEach((item: any) => {
				if (item.isHoliday && keyToDayOfWeek[item.key] !== undefined) {
					holidayDaysOfWeek.add(keyToDayOfWeek[item.key]);
				}
			});
		} else {
			holidayDaysOfWeek.add(0);
			holidayDaysOfWeek.add(6);
		}

		for (let d = 1; d <= daysInMonth; d++) {
			const date = new Date(year, month - 1, d);
			if (!holidayDaysOfWeek.has(date.getDay())) {
				count++;
			}
		}

		return count;
	}, [month, year, parsedWorkdays]);

	const studentAttendanceMap = monthlyData?.attendances ?? {};
	const studentRecords = studentAttendanceMap[studentId] || studentHistoryData?.attendances || [];
	const firstStudent = studentRecords[0]?.student;

	const studentName = firstStudent?.fullname || "Siswa";
	const nipd = firstStudent?.nipd || "-";
	const photo = firstStudent?.photo || "";

	// Compute attendance counts & dayStatusMap
	const { countH, countS, countI, countA, totalDays, rate, dayStatusMap } = useMemo(() => {
		let h = 0;
		let s = 0;
		let i = 0;
		let a = 0;
		const map: Record<number, string> = {};

		studentRecords.forEach((rec) => {
			if (!rec.attendance_date || !rec.attendance_status) return;
			const dateObj = new Date(rec.attendance_date);
			const dayNum = dateObj.getDate();
			const status = rec.attendance_status.toLowerCase();
			map[dayNum] = status;

			if (status === "h") h++;
			else if (status === "s") s++;
			else if (status === "i") i++;
			else if (status === "a") a++;
		});

		const total = effectiveSessionDays;
		const r = total > 0 ? Math.min(100, Math.round((h / total) * 100)) : 0;

		return {
			countH: h,
			countS: s,
			countI: i,
			countA: a,
			totalDays: `${h}/${effectiveSessionDays}`,
			rate: r,
			dayStatusMap: map,
		};
	}, [studentRecords, effectiveSessionDays]);

	const getAttendanceRateBadge = (rate: number) => {
		if (rate >= 90) return <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold">{rate}%</Badge>;
		if (rate >= 75) return <Badge className="bg-amber-500 hover:bg-amber-600 font-bold">{rate}%</Badge>;
		return <Badge variant="destructive" className="font-bold">{rate}%</Badge>;
	};

	const monthName = monthsList.find((m) => m.value === month)?.label;

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				{/* Back Button */}
				<Button variant="ghost" asChild className="mb-2 w-fit">
					<Link href={`/presensi-siswa/rekap/${rombelId}?month=${month}&year=${year}`}>
						<IconArrowLeft className="mr-2 w-4 h-4" />
						Kembali ke {monthlyData?.rombel || selectedRombelObj?.nama || "Daftar Kelas"}
					</Link>
				</Button>

				{/* Header Banner */}
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-6 rounded-xl border shadow-xs">
					<div className="flex items-center gap-4">
						<Avatar className="w-16 h-16 border-2 border-primary/20 shadow-xs">
							<AvatarImage src={photo} alt={studentName} />
							<AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
								{studentName.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<h2 className="font-bold text-2xl tracking-tight">{studentName}</h2>
							<p className="text-muted-foreground text-sm font-medium">
								NIS: {nipd} | {monthlyData?.rombel || selectedRombelObj?.nama || "Rombel"}
							</p>
							<p className="text-muted-foreground text-xs">
								Periode Presensi Apel: {monthName} {year}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">{getAttendanceRateBadge(rate)}</div>
				</div>

				<Separator className="my-4" />

				{/* 6 Metric Stat Cards */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
					<Card className="shadow-2xs">
						<CardContent className="p-4 text-center">
							<div className="font-bold text-emerald-600 text-2xl">{countH}</div>
							<div className="text-muted-foreground text-xs mt-0.5">Hadir</div>
						</CardContent>
					</Card>
					<Card className="shadow-2xs">
						<CardContent className="p-4 text-center">
							<div className="font-bold text-sky-600 text-2xl">{countS}</div>
							<div className="text-muted-foreground text-xs mt-0.5">Sakit</div>
						</CardContent>
					</Card>
					<Card className="shadow-2xs">
						<CardContent className="p-4 text-center">
							<div className="font-bold text-indigo-600 text-2xl">{countI}</div>
							<div className="text-muted-foreground text-xs mt-0.5">Izin</div>
						</CardContent>
					</Card>
					<Card className="shadow-2xs">
						<CardContent className="p-4 text-center">
							<div className="font-bold text-amber-600 text-2xl">{countA}</div>
							<div className="text-muted-foreground text-xs mt-0.5">Alpa</div>
						</CardContent>
					</Card>
					<Card className="shadow-2xs">
						<CardContent className="p-4 text-center">
							<div className="font-bold text-foreground text-2xl">{totalDays}</div>
							<div className="text-muted-foreground text-xs mt-0.5">Total Sesi (Kerja)</div>
						</CardContent>
					</Card>
					<Card className="shadow-2xs">
						<CardContent className="p-4 text-center">
							<div className="font-bold text-emerald-600 text-2xl">{rate}%</div>
							<div className="text-muted-foreground text-xs mt-0.5">Persentase</div>
						</CardContent>
					</Card>
				</div>

				{/* Kalender Kehadiran Card */}
				<Card className="shadow-xs mb-6">
					<CardHeader>
						<CardTitle className="text-xl">Kalender Kehadiran Apel</CardTitle>
						<CardDescription className="text-xs">
							Riwayat visual kehadiran apel pagi siswa selama bulan {monthName} {year}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AttendanceCalendar month={month} year={year} dayStatusMap={dayStatusMap} />
					</CardContent>
				</Card>

				{/* History Log Table */}
				<Card className="shadow-xs overflow-hidden">
					<CardHeader className="bg-muted/30 pb-3">
						<CardTitle className="text-lg">Rincian Log Presensi Apel</CardTitle>
						<CardDescription className="text-xs">
							Log pemindaian dan jam presensi apel per tanggal di bulan {monthName} {year}
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						{isStudentHistoryLoading ? (
							<div className="p-6 space-y-3">
								<Skeleton className="w-full h-10" />
								<Skeleton className="w-full h-10" />
							</div>
						) : studentRecords.length === 0 ? (
							<div className="py-12 text-center text-muted-foreground text-sm italic">
								Belum ada rincian presensi apel untuk siswa ini di bulan {monthName} {year}.
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-muted/50 border-b">
											<TableHead className="w-12 text-center font-bold px-3 text-xs">No</TableHead>
											<TableHead className="font-bold text-xs px-4">Tanggal Presensi</TableHead>
											<TableHead className="text-center font-bold text-xs px-3">Jam Masuk / Scan</TableHead>
											<TableHead className="text-center font-bold text-xs px-3">Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{studentRecords.map((rec, idx) => {
											if (!rec.attendance_date) return null;
											const dateObj = new Date(rec.attendance_date);
											const formattedDate = dateObj.toLocaleDateString("id-ID", {
												weekday: "long",
												day: "numeric",
												month: "long",
												year: "numeric",
											});
											const formattedTime = dateObj.toLocaleTimeString("id-ID", {
												hour: "2-digit",
												minute: "2-digit",
											});

											const status = (rec.attendance_status || "h").toLowerCase();
											let statusBadge = <Badge className="bg-emerald-500 text-white font-bold">Hadir</Badge>;

											if (status === "s") statusBadge = <Badge className="bg-sky-500 text-white font-bold">Sakit</Badge>;
											else if (status === "i") statusBadge = <Badge className="bg-indigo-500 text-white font-bold">Izin</Badge>;
											else if (status === "a") statusBadge = <Badge className="bg-amber-500 text-white font-bold">Alpa</Badge>;

											return (
												<TableRow key={rec.id || idx} className="hover:bg-muted/40 transition-colors border-b">
													<TableCell className="text-center text-xs text-muted-foreground px-3">{idx + 1}</TableCell>
													<TableCell className="font-medium text-xs px-4">{formattedDate}</TableCell>
													<TableCell className="text-center text-xs font-mono px-3">
														<span className="inline-flex items-center gap-1">
															<Clock className="w-3.5 h-3.5 text-muted-foreground" /> {formattedTime} WIB
														</span>
													</TableCell>
													<TableCell className="text-center px-3">{statusBadge}</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// Attendance Calendar component matching /rekap/bulanan/[rombelId]/siswa/[studentId]
function AttendanceCalendar({
	month,
	year,
	dayStatusMap,
}: {
	month: number;
	year: number;
	dayStatusMap: Record<number, string>;
}) {
	const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

	const calendarDays = useMemo(() => {
		const firstDay = new Date(year, month - 1, 1);
		const lastDay = new Date(year, month, 0);
		const daysInMonth = lastDay.getDate();
		const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

		const days: { key: string; day: number | null }[] = [];

		for (let i = 0; i < startDayOfWeek; i++) {
			days.push({ key: `empty-${i}`, day: null });
		}

		for (let day = 1; day <= daysInMonth; day++) {
			days.push({ key: `day-${day}`, day });
		}

		return days;
	}, [month, year]);

	const getStatusColor = (status: string | undefined) => {
		if (!status) return "bg-muted border text-muted-foreground";
		switch (status.toLowerCase()) {
			case "h":
				return "bg-emerald-500 text-white font-bold";
			case "s":
				return "bg-sky-500 text-white font-bold";
			case "i":
				return "bg-indigo-500 text-white font-bold";
			case "a":
				return "bg-amber-500 text-white font-bold";
			default:
				return "bg-muted border text-muted-foreground";
		}
	};

	const getStatusLabel = (status: string | undefined) => {
		if (!status) return "Tidak ada data";
		switch (status.toLowerCase()) {
			case "h":
				return "Hadir";
			case "s":
				return "Sakit";
			case "i":
				return "Izin";
			case "a":
				return "Alpa";
			default:
				return status;
		}
	};

	return (
		<TooltipProvider>
			<div className="w-full">
				<div className="gap-1 grid grid-cols-7 mb-2">
					{dayNames.map((day) => (
						<div key={day} className="p-2 font-medium text-muted-foreground text-sm text-center">
							{day}
						</div>
					))}
				</div>

				<div className="gap-2 grid grid-cols-7">
					{calendarDays.map(({ key, day }) => {
						if (day === null) {
							return <div key={key} className="p-2" />;
						}

						const status = dayStatusMap[day];
						const statusColor = getStatusColor(status);
						const statusLabel = getStatusLabel(status);

						return (
							<Tooltip key={key}>
								<TooltipTrigger asChild>
									<div
										className={`p-2 md:p-3 rounded-lg text-center cursor-default duration-300 transition-all hover:scale-95 ${statusColor}`}
									>
										<div className="font-medium text-sm md:text-base">{day}</div>
										<div className="hidden md:block opacity-90 mt-1 text-xs">
											{status ? status.toUpperCase() : "-"}
										</div>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-xs">
										Tanggal {day}: <span className="font-semibold">{statusLabel}</span>
									</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>

				{/* Legend */}
				<div className="flex flex-wrap gap-4 mt-6 pt-4 border-t text-xs">
					<div className="flex items-center gap-2">
						<div className="bg-emerald-500 rounded w-4 h-4" />
						<span>Hadir (H)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="bg-sky-500 rounded w-4 h-4" />
						<span>Sakit (S)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="bg-indigo-500 rounded w-4 h-4" />
						<span>Izin (I)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="bg-amber-500 rounded w-4 h-4" />
						<span>Alpa (A)</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="bg-muted border rounded w-4 h-4" />
						<span>Tidak Ada Data</span>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}
