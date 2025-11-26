"use client";

import BaseLoading from "@/components/base-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	useExportMonthlyStudentRecapMutation,
	useMonthlyStudentRecapMutation,
} from "@/queries/useExportQuery";
import type {
	DailyAttendance,
	MonthlyStudentRecapResponse,
} from "@/types/monthly-recap";
import { IconArrowLeft, IconDownload } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function RekapBulananSiswaPage() {
	const params = useParams<{ rombelId: string; studentId: string }>();
	const rombelId = useMemo(() => params?.rombelId ?? "", [params]);
	const studentId = useMemo(() => params?.studentId ?? "", [params]);

	const searchParams = useSearchParams();
	const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
	const year = Number(searchParams.get("year")) || new Date().getFullYear();

	const [isLoading, setIsLoading] = useState(true);
	const [exportLoading, setExportLoading] = useState(false);
	const [data, setData] = useState<MonthlyStudentRecapResponse | null>(null);

	const monthlyStudentRecapMutation = useMonthlyStudentRecapMutation();
	const exportMonthlyStudentRecapMutation =
		useExportMonthlyStudentRecapMutation();

	useEffect(() => {
		if (!rombelId || !studentId) return;
		setIsLoading(true);
		monthlyStudentRecapMutation
			.mutateAsync({
				student_id: studentId,
				rombel_id: rombelId,
				month,
				year,
			})
			.then((res) => setData(res))
			.catch((err) => {
				console.error("Error fetching student detail:", err);
				setData(null);
			})
			.finally(() => setIsLoading(false));
	}, [
		rombelId,
		studentId,
		month,
		year,
		monthlyStudentRecapMutation.mutateAsync,
	]);

	const handleExport = async () => {
		if (!rombelId || !studentId) return;
		try {
			setExportLoading(true);
			const blob = await exportMonthlyStudentRecapMutation.mutateAsync({
				student_id: studentId,
				rombel_id: rombelId,
				month,
				year,
			});

			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			const filename = `rekap-bulanan-siswa-${data?.meta.student_name || studentId}-${month}-${year}.xlsx`;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting student recap:", error);
		} finally {
			setExportLoading(false);
		}
	};

	const getAttendanceRateBadge = (rate: number) => {
		if (rate >= 90) {
			return <Badge className="bg-green-500 hover:bg-green-600">{rate}%</Badge>;
		}
		if (rate >= 75) {
			return (
				<Badge className="bg-yellow-500 hover:bg-yellow-600">{rate}%</Badge>
			);
		}
		return <Badge variant="destructive">{rate}%</Badge>;
	};

	if (isLoading) {
		return <BaseLoading />;
	}

	if (!rombelId || !studentId) {
		return (
			<div className="flex flex-col space-y-5 h-full">
				<div className="space-y-1 mt-5">
					<Button variant="ghost" asChild className="mb-4">
						<Link href={`/rekap/bulanan?month=${month}&year=${year}`}>
							<IconArrowLeft className="mr-2 w-4 h-4" />
							Kembali
						</Link>
					</Button>
					<Card>
						<CardContent className="py-10 text-center">
							<p className="text-muted-foreground">Data tidak ditemukan</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex flex-col space-y-5 h-full">
				<div className="space-y-1 mt-5">
					<Button variant="ghost" asChild className="mb-4">
						<Link
							href={`/rekap/bulanan/${rombelId}?month=${month}&year=${year}`}
						>
							<IconArrowLeft className="mr-2 w-4 h-4" />
							Kembali
						</Link>
					</Button>
					<Card>
						<CardContent className="py-10 text-center">
							<p className="text-muted-foreground">Gagal memuat data siswa</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				{/* Back button */}
				<Button variant="ghost" asChild className="mb-2 w-fit">
					<Link href={`/rekap/bulanan/${rombelId}?month=${month}&year=${year}`}>
						<IconArrowLeft className="mr-2 w-4 h-4" />
						Kembali ke {data.meta.rombel_nama}
					</Link>
				</Button>

				<div className="flex md:flex-row flex-col justify-between">
					<div className="flex items-center gap-4 mt-2">
						<Avatar className="w-16 h-16">
							<AvatarImage src={data.meta.photo} alt={data.meta.student_name} />
							<AvatarFallback className="text-xl">
								{data.meta.student_name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<h2 className="font-semibold text-2xl tracking-tight">
								{data.meta.student_name}
							</h2>
							<p className="text-muted-foreground text-sm">
								NIS: {data.meta.nipd} | {data.meta.rombel_nama} |{" "}
								{data.meta.jurusan}
							</p>
							<p className="text-muted-foreground text-sm">
								{data.meta.period}
							</p>
						</div>
					</div>
					<div className="flex items-end mt-4 md:mt-0">
						<Button
							onClick={handleExport}
							disabled={exportLoading}
							variant="outline"
						>
							{exportLoading ? (
								<Loader2 className="mr-2 w-4 h-4 animate-spin" />
							) : (
								<IconDownload className="mr-2 w-4 h-4" />
							)}
							Unduh Excel
						</Button>
					</div>
				</div>
				<Separator className="my-4" />

				{/* Summary stats */}
				<div className="gap-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-green-600 text-2xl">
								{data.summary.count_h}
							</div>
							<div className="text-muted-foreground text-sm">Hadir</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-blue-600 text-2xl">
								{data.summary.count_s}
							</div>
							<div className="text-muted-foreground text-sm">Sakit</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-purple-600 text-2xl">
								{data.summary.count_i}
							</div>
							<div className="text-muted-foreground text-sm">Izin</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-orange-600 text-2xl">
								{data.summary.count_a}
							</div>
							<div className="text-muted-foreground text-sm">Alpa</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-red-600 text-2xl">
								{data.summary.count_b}
							</div>
							<div className="text-muted-foreground text-sm">Bolos</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-2xl">
								{data.summary.total_days}
							</div>
							<div className="text-muted-foreground text-sm">Total Hari</div>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<div className="font-bold text-2xl">
								{getAttendanceRateBadge(data.summary.attendance_rate)}
							</div>
							<div className="mt-1 text-muted-foreground text-sm">
								Kehadiran
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Daily Attendance Calendar */}
				<Card>
					<CardHeader>
						<CardTitle>Kalender Kehadiran</CardTitle>
						<CardDescription>
							Riwayat kehadiran siswa selama bulan {data.meta.period}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<AttendanceCalendar
							month={month}
							year={year}
							dailyAttendance={data.daily_attendance}
							period={data.meta.period}
						/>
						{/* Legend */}
						<div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
							<div className="flex items-center gap-2">
								<div className="bg-green-500 rounded w-4 h-4" />
								<span className="text-sm">Hadir</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-blue-500 rounded w-4 h-4" />
								<span className="text-sm">Sakit</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-purple-500 rounded w-4 h-4" />
								<span className="text-sm">Izin</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-orange-500 rounded w-4 h-4" />
								<span className="text-sm">Alpa</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-red-500 rounded w-4 h-4" />
								<span className="text-sm">Bolos</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="bg-muted border rounded w-4 h-4" />
								<span className="text-sm">Tidak ada data</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// Calendar component for attendance view
function AttendanceCalendar({
	month,
	year,
	dailyAttendance,
	period,
}: {
	month: number;
	year: number;
	dailyAttendance: DailyAttendance[];
	period: string;
}) {
	const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

	// Build attendance map for quick lookup
	const attendanceMap = useMemo(() => {
		const map: Record<number, DailyAttendance> = {};
		for (const att of dailyAttendance) {
			// Use day_number if available, otherwise extract from date (format: "2025-08-01")
			if (att.day_number) {
				map[att.day_number] = att;
			} else {
				// Parse date format "YYYY-MM-DD"
				const parts = att.date.split("-");
				if (parts.length === 3) {
					const day = Number.parseInt(parts[2], 10);
					map[day] = att;
				}
			}
		}
		return map;
	}, [dailyAttendance]);

	// Calculate calendar grid
	const calendarDays = useMemo(() => {
		const firstDay = new Date(year, month - 1, 1);
		const lastDay = new Date(year, month, 0);
		const daysInMonth = lastDay.getDate();
		const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

		const days: { key: string; day: number | null }[] = [];

		// Add empty cells for days before the first of the month
		for (let i = 0; i < startDayOfWeek; i++) {
			days.push({ key: `empty-${i}`, day: null });
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push({ key: `day-${day}`, day });
		}

		return days;
	}, [month, year]);

	const getStatusColor = (status: string | undefined) => {
		if (!status) return "bg-muted border";
		switch (status.toUpperCase()) {
			case "H":
				return "bg-green-500 text-white";
			case "S":
				return "bg-blue-500 text-white";
			case "I":
				return "bg-purple-500 text-white";
			case "A":
				return "bg-orange-500 text-white";
			case "B":
				return "bg-red-500 text-white";
			default:
				return "bg-muted border";
		}
	};

	const getStatusLabel = (status: string | undefined) => {
		if (!status) return "Tidak ada data";
		switch (status.toUpperCase()) {
			case "H":
				return "Hadir";
			case "S":
				return "Sakit";
			case "I":
				return "Izin";
			case "A":
				return "Alpa";
			case "B":
				return "Bolos";
			default:
				return status;
		}
	};

	return (
		<TooltipProvider>
			<div className="w-full">
				{/* Day headers */}
				<div className="gap-1 grid grid-cols-7 mb-2">
					{dayNames.map((day) => (
						<div
							key={day}
							className="p-2 font-medium text-muted-foreground text-sm text-center"
						>
							{day}
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="gap-2 grid grid-cols-7">
					{calendarDays.map(({ key, day }) => {
						if (day === null) {
							return <div key={key} className="p-2" />;
						}

						const attendance = attendanceMap[day];
						const statusColor = getStatusColor(attendance?.status);
						const statusLabel = getStatusLabel(attendance?.status);

						return (
							<Tooltip key={key}>
								<TooltipTrigger asChild>
									<div
										className={`p-2 md:p-3 rounded-lg text-center cursor-default 
                                            duration-300 transition-all hover:scale-95 ${statusColor}`}
									>
										<div className="font-medium text-sm md:text-base">
											{day}
										</div>
										<div className="hidden md:block opacity-80 mt-1 text-xs">
											{attendance?.status || "-"}
										</div>
									</div>
								</TooltipTrigger>
								<TooltipContent>
									<div className="text-sm">
										<div className="font-medium">
											{day} {period}
										</div>
										<div>{statusLabel}</div>
										{attendance?.notes && (
											<div className="mt-1 text-muted-foreground">
												{attendance.notes}
											</div>
										)}
									</div>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</div>
		</TooltipProvider>
	);
}
