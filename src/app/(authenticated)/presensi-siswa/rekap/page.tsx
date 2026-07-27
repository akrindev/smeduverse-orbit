"use client";

import { Calendar, Filter, Layers } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMonthlyApelAttendanceQuery } from "@/queries/useApelAttendanceQuery";
import { useRombelsQuery } from "@/queries/useRombelQuery";

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

export default function PresensiSiswaRekapPage() {
	const currentDate = new Date();
	const [selectedRombel, setSelectedRombel] = useState<string>("");
	const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
	const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
	const [viewMode, setViewMode] = useState<"bulanan" | "mingguan">("bulanan");

	const { data: rombels } = useRombelsQuery();

	const { data: monthlyData, isLoading: isMonthlyLoading } = useMonthlyApelAttendanceQuery({
		rombel_id: selectedRombel,
		month: selectedMonth,
		year: selectedYear,
	});

	// Days calculation
	const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
	const fullDaysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
	// Mingguan view: days 1..7 (or current 7-day range)
	const daysArray = viewMode === "mingguan" ? fullDaysArray.slice(0, 7) : fullDaysArray;

	const studentAttendanceMap = monthlyData?.attendances ?? {};
	const studentKeys = Object.keys(studentAttendanceMap);

	return (
		<div className="space-y-6 max-w-full overflow-hidden">
			{/* Filter Section */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Filter Rekap Presensi</CardTitle>
					<CardDescription className="text-xs">
						Pilih Rombongan Belajar, Periode, dan Mode Tampilan (Mingguan / Bulanan)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Mode Tampilan Select */}
						<div className="space-y-1.5">
							<label htmlFor="view-mode-select" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Layers className="w-3.5 h-3.5" /> Mode Tampilan
							</label>
							<Select value={viewMode} onValueChange={(val: "bulanan" | "mingguan") => setViewMode(val)}>
								<SelectTrigger id="view-mode-select">
									<SelectValue placeholder="Pilih Mode" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="bulanan">Tampilan Bulanan (1-{daysInMonth})</SelectItem>
									<SelectItem value="mingguan">Tampilan Mingguan (7 Hari)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Rombel Select */}
						<div className="space-y-1.5">
							<label htmlFor="rombel-select" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Filter className="w-3.5 h-3.5" /> Rombongan Belajar
							</label>
							<Select value={selectedRombel} onValueChange={setSelectedRombel}>
								<SelectTrigger id="rombel-select">
									<SelectValue placeholder="Pilih Rombel" />
								</SelectTrigger>
								<SelectContent>
									{rombels?.map((rombel) => (
										<SelectItem key={rombel.id} value={rombel.id}>
											{rombel.nama}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Month Select */}
						<div className="space-y-1.5">
							<label htmlFor="month-select" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Calendar className="w-3.5 h-3.5" /> Bulan
							</label>
							<Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
								<SelectTrigger id="month-select">
									<SelectValue placeholder="Pilih Bulan" />
								</SelectTrigger>
								<SelectContent>
									{monthsList.map((m) => (
										<SelectItem key={m.value} value={String(m.value)}>
											{m.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Year Select */}
						<div className="space-y-1.5">
							<label htmlFor="year-select" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Calendar className="w-3.5 h-3.5" /> Tahun
							</label>
							<Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
								<SelectTrigger id="year-select">
									<SelectValue placeholder="Pilih Tahun" />
								</SelectTrigger>
								<SelectContent>
									{[2024, 2025, 2026, 2027].map((y) => (
										<SelectItem key={y} value={String(y)}>
											{y}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Clean, Non-Overlapping Matrix Table (matching /rekap/bulanan pattern) */}
			<Card className="shadow-xs overflow-hidden">
				<CardHeader className="pb-3 flex flex-row items-center justify-between flex-wrap gap-2 border-b bg-muted/20">
					<div>
						<CardTitle className="text-base flex items-center gap-2">
							Matriks Rekap ({viewMode === "bulanan" ? "Bulanan" : "Mingguan"}): {monthlyData?.rombel || "Rombel"}
						</CardTitle>
						<CardDescription className="text-xs">
							Periode: {monthsList.find((m) => m.value === selectedMonth)?.label} {selectedYear}
						</CardDescription>
					</div>
					{selectedRombel && (
						<Badge variant="outline" className="text-xs">
							Total {studentKeys.length} Siswa
						</Badge>
					)}
				</CardHeader>
				<CardContent className="p-0">
					{!selectedRombel ? (
						<div className="m-4 py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Silakan pilih Rombongan Belajar terlebih dahulu untuk menampilkan rekap.
						</div>
					) : isMonthlyLoading ? (
						<div className="p-4 space-y-3">
							<Skeleton className="w-full h-12" />
							<Skeleton className="w-full h-12" />
							<Skeleton className="w-full h-12" />
						</div>
					) : studentKeys.length === 0 ? (
						<div className="m-4 py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Belum ada data presensi untuk Rombel terpilih pada periode ini.
						</div>
					) : (
						/* Clean, non-overlapping overflow scroll area matching /rekap/bulanan */
						<div className="overflow-x-auto w-full">
							<Table className="min-w-max border-collapse">
								<TableHeader>
									<TableRow className="bg-muted/50 border-b">
										<TableHead className="w-12 text-center font-bold text-xs px-2">No</TableHead>
										<TableHead className="min-w-48 font-bold text-xs px-3">Nama Siswa</TableHead>
										<TableHead className="text-center font-bold text-xs px-2">NIS</TableHead>
										{daysArray.map((day) => (
											<TableHead key={day} className="text-center w-9 min-w-9 px-1 text-xs font-semibold">
												{day}
											</TableHead>
										))}
										<TableHead className="text-center w-10 px-1 font-bold text-emerald-600 text-xs">H</TableHead>
										<TableHead className="text-center w-10 px-1 font-bold text-amber-600 text-xs">S</TableHead>
										<TableHead className="text-center w-10 px-1 font-bold text-blue-600 text-xs">I</TableHead>
										<TableHead className="text-center w-10 px-1 font-bold text-red-600 text-xs">A</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{studentKeys.map((stId, idx) => {
										const records = studentAttendanceMap[stId] || [];
										const firstStudent = records[0]?.student;
										const studentName = firstStudent?.fullname || stId;

										// Map records by day of month
										const dayStatusMap: Record<number, string> = {};
										let countH = 0;
										let countS = 0;
										let countI = 0;
										let countA = 0;

										records.forEach((rec) => {
											const dateObj = new Date(rec.attendance_date);
											const dayNum = dateObj.getDate();
											const status = (rec.attendance_status || "h").toLowerCase();
											dayStatusMap[dayNum] = status;

											if (status === "h") countH++;
											else if (status === "s") countS++;
											else if (status === "i") countI++;
											else if (status === "a") countA++;
										});

										return (
											<TableRow key={stId} className="hover:bg-muted/40 transition-colors border-b">
												<TableCell className="text-center font-medium text-xs text-muted-foreground w-12 px-2">
													{idx + 1}
												</TableCell>
												<TableCell className="font-semibold text-xs min-w-48 px-3">
													{studentName}
												</TableCell>
												<TableCell className="text-center text-xs font-mono text-muted-foreground px-2">
													{firstStudent?.nipd || "-"}
												</TableCell>
												{daysArray.map((day) => {
													const status = dayStatusMap[day];
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
													{countH}
												</TableCell>
												<TableCell className="text-center font-bold text-xs text-amber-600 bg-amber-50/40 dark:bg-amber-950/20">
													{countS}
												</TableCell>
												<TableCell className="text-center font-bold text-xs text-blue-600 bg-blue-50/40 dark:bg-blue-950/20">
													{countI}
												</TableCell>
												<TableCell className="text-center font-bold text-xs text-red-600 bg-red-50/40 dark:bg-red-950/20">
													{countA}
												</TableCell>
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
	);
}
