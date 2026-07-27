"use client";

import BaseLoading from "@/components/base-loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthlyApelAttendanceQuery, useOrbitSettingQuery } from "@/queries/useApelAttendanceQuery";
import { useRombelsQuery } from "@/queries/useRombelQuery";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import { Layers } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import MonthYearSelector from "@/app/(authenticated)/rekap/bulanan/components/month-year-selector";

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

export default function PresensiSiswaRekapRombelPage() {
	const router = useRouter();
	const params = useParams<{ rombelId: string }>();
	const rombelId = useMemo(() => params?.rombelId ?? "", [params]);

	const searchParams = useSearchParams();
	const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
	const year = Number(searchParams.get("year")) || new Date().getFullYear();

	const [viewType, setViewType] = useState<"ringkasan" | "matriks">("ringkasan");

	const { data: rombels } = useRombelsQuery();
	const selectedRombelObj = rombels?.find((r) => r.id === rombelId);

	const { data: monthlyData, isLoading: isMonthlyLoading } = useMonthlyApelAttendanceQuery({
		rombel_id: rombelId,
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

	// Days calculation for matrix
	const daysInMonth = new Date(year, month, 0).getDate();
	const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	const studentAttendanceMap = monthlyData?.attendances ?? {};
	const studentKeys = Object.keys(studentAttendanceMap);

	// Calculate student summary stats
	const studentStatsList = useMemo(() => {
		return studentKeys.map((stId) => {
			const records = studentAttendanceMap[stId] || [];
			const firstStudent = records[0]?.student;
			const studentName = firstStudent?.fullname || stId;
			const nipd = firstStudent?.nipd || "-";
			const photo = firstStudent?.photo || "";

			let countH = 0;
			let countS = 0;
			let countI = 0;
			let countA = 0;

			const dayStatusMap: Record<number, string> = {};

			records.forEach((rec) => {
				if (!rec.attendance_date || !rec.attendance_status) return;
				const dateObj = new Date(rec.attendance_date);
				const dayNum = dateObj.getDate();
				const status = rec.attendance_status.toLowerCase();
				dayStatusMap[dayNum] = status;

				if (status === "h") countH++;
				else if (status === "s") countS++;
				else if (status === "i") countI++;
				else if (status === "a") countA++;
			});

			const totalDisplay = `${countH}/${effectiveSessionDays}`;
			const rate = effectiveSessionDays > 0 ? Math.min(100, Math.round((countH / effectiveSessionDays) * 100)) : 0;

			return {
				stId,
				studentName,
				nipd,
				photo,
				countH,
				countS,
				countI,
				countA,
				totalDisplay,
				dayStatusMap,
				rate,
			};
		});
	}, [studentKeys, studentAttendanceMap, effectiveSessionDays]);

	const getAttendanceRateBadge = (rate: number) => {
		if (rate >= 90) return <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold">{rate}%</Badge>;
		if (rate >= 75) return <Badge className="bg-amber-500 hover:bg-amber-600 font-bold">{rate}%</Badge>;
		return <Badge variant="destructive" className="font-bold">{rate}%</Badge>;
	};

	const monthName = monthsList.find((m) => m.value === month)?.label;

	const jurusanNama =
		typeof selectedRombelObj?.jurusan === "object"
			? selectedRombelObj?.jurusan?.nama || selectedRombelObj?.jurusan?.kode || "Presensi Apel Pagi"
			: selectedRombelObj?.jurusan || "Presensi Apel Pagi";

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				{/* Back Button */}
				<Button variant="ghost" asChild className="mb-2 w-fit">
					<Link href={`/presensi-siswa/rekap?month=${month}&year=${year}`}>
						<IconArrowLeft className="mr-2 w-4 h-4" />
						Kembali ke Rekap Bulanan
					</Link>
				</Button>

				{/* Header & Mode Switcher */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
					<div className="space-y-1">
						<h2 className="font-semibold text-2xl tracking-tight text-primary">
							{monthlyData?.rombel || selectedRombelObj?.nama || "Rekap Kelas"}
						</h2>
						<p className="text-muted-foreground text-sm font-medium">
							{jurusanNama} | {monthName} {year}
						</p>
					</div>

					<div className="flex flex-col sm:flex-row items-end gap-4 w-full md:w-auto">
						<div className="w-full sm:w-64">
							<MonthYearSelector
								month={month}
								year={year}
								onMonthChange={(m) => router.push(`/presensi-siswa/rekap/${rombelId}?month=${m}&year=${year}`)}
								onYearChange={(y) => router.push(`/presensi-siswa/rekap/${rombelId}?month=${month}&year=${y}`)}
							/>
						</div>

						<div className="w-full sm:w-56 space-y-1">
							<label htmlFor="view-type-select" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
								<Layers className="w-3.5 h-3.5" /> Tampilan Detail
							</label>
							<Select value={viewType} onValueChange={(val: "ringkasan" | "matriks") => setViewType(val)}>
								<SelectTrigger id="view-type-select" className="h-9 text-xs">
									<SelectValue placeholder="Pilih Tampilan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ringkasan">Daftar Ringkasan Siswa</SelectItem>
									<SelectItem value="matriks">Matriks Presensi Harian (1-{daysInMonth})</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>

				<Separator className="my-4" />

				{/* Summary Stats Badges */}
				<div className="flex flex-wrap gap-4 mb-4">
					<Badge variant="outline" className="px-3 py-1 text-sm">
						Total Siswa: {studentKeys.length}
					</Badge>
					<Badge variant="outline" className="px-3 py-1 text-sm">
						Total Hari Sesi (Hari Kerja): {effectiveSessionDays} Hari
					</Badge>
				</div>

				{/* Students Table matching /rekap/bulanan/[rombelId] */}
				<Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-xs">
					<CardHeader className="bg-muted/30">
						<CardTitle className="text-xl">Daftar Siswa</CardTitle>
						<CardDescription>
							Klik pada nama siswa untuk melihat detail kehadiran individual
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						{isMonthlyLoading ? (
							<div className="p-6 space-y-3">
								<Skeleton className="w-full h-12" />
								<Skeleton className="w-full h-12" />
								<Skeleton className="w-full h-12" />
							</div>
						) : studentStatsList.length === 0 ? (
							<div className="py-12 text-center text-muted-foreground text-sm italic">
								Tidak ada data presensi siswa untuk kelas ini pada bulan {monthName} {year}.
							</div>
						) : viewType === "ringkasan" ? (
							/* SUMMARY STUDENT TABLE (CLICKABLE ROWS) */
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent border-b">
											<TableHead className="w-12 font-bold px-4">No</TableHead>
											<TableHead className="font-bold">Siswa</TableHead>
											<TableHead className="text-center font-bold">NIS</TableHead>
											<TableHead className="text-center font-bold">H</TableHead>
											<TableHead className="text-center font-bold">S</TableHead>
											<TableHead className="text-center font-bold">I</TableHead>
											<TableHead className="text-center font-bold">A</TableHead>
											<TableHead className="text-center font-bold">Total</TableHead>
											<TableHead className="text-center font-bold">%</TableHead>
											<TableHead className="w-12"></TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{studentStatsList.map((st, index) => (
											<TableRow key={st.stId} className="hover:bg-muted/80 cursor-pointer group transition-colors border-b">
												<TableCell className="px-4 text-xs font-medium text-muted-foreground">{index + 1}</TableCell>
												<TableCell>
													<Link
														href={`/presensi-siswa/rekap/${rombelId}/siswa/${st.stId}?month=${month}&year=${year}`}
														className="flex items-center gap-3"
													>
														<Avatar className="w-9 h-9 border-2 border-background shadow-xs">
															<AvatarImage src={st.photo} alt={st.studentName} />
															<AvatarFallback className="bg-primary/10 text-primary font-bold">
																{st.studentName.charAt(0).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<span className="font-semibold text-sm group-hover:text-primary transition-colors">
															{st.studentName}
														</span>
													</Link>
												</TableCell>
												<TableCell className="text-center font-mono text-xs text-muted-foreground">{st.nipd}</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-2xs border-none font-bold">
														{st.countH}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-sky-500 hover:bg-sky-600 shadow-2xs border-none font-bold">
														{st.countS}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-indigo-500 hover:bg-indigo-600 shadow-2xs border-none font-bold">
														{st.countI}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-amber-500 hover:bg-amber-600 shadow-2xs border-none font-bold">
														{st.countA}
													</Badge>
												</TableCell>
												<TableCell className="font-bold text-center text-xs">{st.totalDisplay}</TableCell>
												<TableCell className="text-center">{getAttendanceRateBadge(st.rate)}</TableCell>
												<TableCell className="text-center">
													<Link href={`/presensi-siswa/rekap/${rombelId}/siswa/${st.stId}?month=${month}&year=${year}`}>
														<IconChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
													</Link>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : (
							/* MATRIX TABLE VIEW (DAYS 1-31) */
							<div className="overflow-x-auto w-full">
								<Table className="min-w-max border-collapse">
									<TableHeader>
										<TableRow className="hover:bg-transparent border-b">
											<TableHead className="w-12 text-center font-bold px-3">No</TableHead>
											<TableHead className="min-w-48 font-bold px-4">Siswa</TableHead>
											<TableHead className="text-center font-bold px-3">NIS</TableHead>
											{daysArray.map((day) => (
												<TableHead key={day} className="text-center w-9 min-w-9 px-1 font-semibold text-xs">
													{day}
												</TableHead>
											))}
											<TableHead className="text-center font-bold text-emerald-600 w-10 px-2">H</TableHead>
											<TableHead className="text-center font-bold text-amber-600 w-10 px-2">S</TableHead>
											<TableHead className="text-center font-bold text-blue-600 w-10 px-2">I</TableHead>
											<TableHead className="text-center font-bold text-red-600 w-10 px-2">A</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{studentStatsList.map((st, idx) => (
											<TableRow key={st.stId} className="border-b hover:bg-muted/40 transition-colors">
												<TableCell className="text-center font-medium text-xs text-muted-foreground w-12 px-3">
													{idx + 1}
												</TableCell>
												<TableCell className="font-semibold text-xs min-w-48 px-4">
													<Link
														href={`/presensi-siswa/rekap/${rombelId}/siswa/${st.stId}?month=${month}&year=${year}`}
														className="hover:text-primary hover:underline"
													>
														{st.studentName}
													</Link>
												</TableCell>
												<TableCell className="text-center text-xs font-mono text-muted-foreground px-3">
													{st.nipd}
												</TableCell>
												{daysArray.map((day) => {
													const status = st.dayStatusMap[day];
													let badgeColor = "bg-muted text-muted-foreground/30";

													if (status === "h") badgeColor = "bg-emerald-500 text-white font-bold";
													else if (status === "s") badgeColor = "bg-amber-500 text-white font-bold";
													else if (status === "i") badgeColor = "bg-blue-500 text-white font-bold";
													else if (status === "a") badgeColor = "bg-red-500 text-white font-bold";

													return (
														<TableCell key={day} className="text-center p-1 text-xs">
															{status ? (
																<span
																	className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] ${badgeColor}`}
																>
																	{status.toUpperCase()}
																</span>
															) : (
																<span className="text-muted-foreground/20 text-[10px]">•</span>
															)}
														</TableCell>
													);
												})}
												<TableCell className="text-center font-bold text-xs text-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/20">
													{st.countH}
												</TableCell>
												<TableCell className="text-center font-bold text-xs text-amber-600 bg-amber-50/40 dark:bg-amber-950/20">
													{st.countS}
												</TableCell>
												<TableCell className="text-center font-bold text-xs text-blue-600 bg-blue-50/40 dark:bg-blue-950/20">
													{st.countI}
												</TableCell>
												<TableCell className="text-center font-bold text-xs text-red-600 bg-red-50/40 dark:bg-red-950/20">
													{st.countA}
												</TableCell>
											</TableRow>
										))}
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
