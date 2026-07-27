"use client";

import { Calendar, Filter } from "lucide-react";
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

	const { data: rombels } = useRombelsQuery();

	const { data: monthlyData, isLoading: isMonthlyLoading } = useMonthlyApelAttendanceQuery({
		rombel_id: selectedRombel,
		month: selectedMonth,
		year: selectedYear,
	});

	// Get total days in month
	const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
	const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	const studentAttendanceMap = monthlyData?.attendances ?? {};
	const studentKeys = Object.keys(studentAttendanceMap);

	return (
		<div className="space-y-6">
			{/* Filter Section */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Filter Rekap Bulanan</CardTitle>
					<CardDescription className="text-xs">
						Pilih Rombongan Belajar, Bulan, dan Tahun untuk menampilkan matriks rekap kehadiran
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

			{/* Matrix Table */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3 flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">
							Matriks Rekap Kehadiran Apel ({monthlyData?.rombel || "Rombel"})
						</CardTitle>
						<CardDescription className="text-xs">
							Bulan: {monthsList.find((m) => m.value === selectedMonth)?.label} {selectedYear}
						</CardDescription>
					</div>
					{selectedRombel && (
						<Badge variant="outline" className="text-xs">
							Total {studentKeys.length} Siswa
						</Badge>
					)}
				</CardHeader>
				<CardContent>
					{!selectedRombel ? (
						<div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Silakan pilih Rombongan Belajar terlebih dahulu untuk menampilkan rekap bulanan.
						</div>
					) : isMonthlyLoading ? (
						<div className="space-y-3">
							<Skeleton className="w-full h-12" />
							<Skeleton className="w-full h-12" />
							<Skeleton className="w-full h-12" />
						</div>
					) : studentKeys.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Belum ada data presensi bulanan untuk Rombel terpilih.
						</div>
					) : (
						<div className="border rounded-md overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="bg-muted/50">
										<TableHead className="w-[50px] sticky left-0 bg-muted/90 z-10">No</TableHead>
										<TableHead className="min-w-[180px] sticky left-[50px] bg-muted/90 z-10 border-r">
											Nama Siswa
										</TableHead>
										{daysArray.map((day) => (
											<TableHead key={day} className="text-center w-[36px] min-w-[36px] px-1 text-xs">
												{day}
											</TableHead>
										))}
										<TableHead className="text-center w-[40px] px-1 font-semibold text-emerald-600">H</TableHead>
										<TableHead className="text-center w-[40px] px-1 font-semibold text-amber-600">S</TableHead>
										<TableHead className="text-center w-[40px] px-1 font-semibold text-blue-600">I</TableHead>
										<TableHead className="text-center w-[40px] px-1 font-semibold text-red-600">A</TableHead>
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
											<TableRow key={stId}>
												<TableCell className="font-medium text-xs sticky left-0 bg-background z-10">
													{idx + 1}
												</TableCell>
												<TableCell className="font-semibold text-xs sticky left-[50px] bg-background z-10 border-r truncate max-w-[200px]">
													{studentName}
												</TableCell>

												{daysArray.map((day) => {
													const status = dayStatusMap[day];
													return (
														<TableCell key={day} className="text-center px-1 text-xs py-2">
															{status === "h" && <span className="font-bold text-emerald-600">H</span>}
															{status === "s" && <span className="font-bold text-amber-600">S</span>}
															{status === "i" && <span className="font-bold text-blue-600">I</span>}
															{status === "a" && <span className="font-bold text-red-600">A</span>}
															{!status && <span className="text-muted-foreground/30">-</span>}
														</TableCell>
													);
												})}

												<TableCell className="text-center font-bold text-emerald-600 text-xs px-1">
													{countH}
												</TableCell>
												<TableCell className="text-center font-bold text-amber-600 text-xs px-1">
													{countS}
												</TableCell>
												<TableCell className="text-center font-bold text-blue-600 text-xs px-1">
													{countI}
												</TableCell>
												<TableCell className="text-center font-bold text-red-600 text-xs px-1">
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
