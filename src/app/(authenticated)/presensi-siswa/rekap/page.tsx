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
import { useMonthlyApelAttendanceQuery } from "@/queries/useApelAttendanceQuery";
import { useRombelsQuery } from "@/queries/useRombelQuery";
import { IconArrowLeft, IconChevronRight, IconUsers } from "@tabler/icons-react";
import { Layers, User } from "lucide-react";
import { useMemo, useState } from "react";
import MonthYearSelector from "../../rekap/bulanan/components/month-year-selector";

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
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [year, setYear] = useState(currentDate.getFullYear());
	const [selectedRombel, setSelectedRombel] = useState<string>("");
	const [viewType, setViewType] = useState<"ringkasan" | "matriks">("ringkasan");

	const { data: rombels, isLoading: isRombelsLoading } = useRombelsQuery();

	const { data: monthlyData, isLoading: isMonthlyLoading } = useMonthlyApelAttendanceQuery({
		rombel_id: selectedRombel,
		month,
		year,
	});

	// Group rombels by grade level (tingkat_kelas)
	const groupedRombels = useMemo(() => {
		if (!rombels) return {};
		return rombels.reduce(
			(acc, r) => {
				const grade = r.tingkat_kelas || 10;
				if (!acc[grade]) acc[grade] = [];
				acc[grade].push(r);
				return acc;
			},
			{} as Record<number, typeof rombels>,
		);
	}, [rombels]);

	const sortedGrades = useMemo(() => {
		return Object.keys(groupedRombels)
			.map(Number)
			.sort((a, b) => a - b);
	}, [groupedRombels]);

	// Days calculation for matrix
	const daysInMonth = new Date(year, month, 0).getDate();
	const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

	const studentAttendanceMap = monthlyData?.attendances ?? {};
	const studentKeys = Object.keys(studentAttendanceMap);

	const selectedRombelObj = rombels?.find((r) => r.id === selectedRombel);

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
				const dateObj = new Date(rec.attendance_date);
				const dayNum = dateObj.getDate();
				const status = (rec.attendance_status || "h").toLowerCase();
				dayStatusMap[dayNum] = status;

				if (status === "h") countH++;
				else if (status === "s") countS++;
				else if (status === "i") countI++;
				else if (status === "a") countA++;
			});

			const totalDays = countH + countS + countI + countA;
			const rate = totalDays > 0 ? Math.round((countH / totalDays) * 100) : 0;

			return {
				stId,
				studentName,
				nipd,
				photo,
				countH,
				countS,
				countI,
				countA,
				totalDays,
				rate,
				dayStatusMap,
			};
		});
	}, [studentKeys, studentAttendanceMap]);

	const getAttendanceRateBadge = (rate: number) => {
		if (rate >= 90) return <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold">{rate}%</Badge>;
		if (rate >= 75) return <Badge className="bg-amber-500 hover:bg-amber-600 font-bold">{rate}%</Badge>;
		return <Badge variant="destructive" className="font-bold">{rate}%</Badge>;
	};

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				{/* Top Bar Header */}
				<div className="flex md:flex-row flex-col justify-between items-start md:items-center">
					<div className="space-y-1">
						<h2 className="font-semibold text-2xl tracking-tight text-primary">
							Rekap Kehadiran Apel Bulanan
						</h2>
						<p className="text-muted-foreground text-sm">
							Rekap kehadiran siswa per bulan berdasarkan kelas dan presensi apel pagi
						</p>
					</div>

					{selectedRombel && (
						<Button
							variant="outline"
							onClick={() => setSelectedRombel("")}
							className="mt-4 md:mt-0 font-medium"
						>
							<IconArrowLeft className="mr-2 w-4 h-4" /> Kembali ke Rekap Bulanan
						</Button>
					)}
				</div>

				<Separator className="my-4" />

				{/* Filter Row matching /rekap/bulanan */}
				<div className="grid grid-cols-12 gap-4 items-center">
					<div className="col-span-12 md:col-span-6">
						<MonthYearSelector
							month={month}
							year={year}
							onMonthChange={setMonth}
							onYearChange={setYear}
						/>
					</div>

					{selectedRombel && (
						<div className="col-span-12 md:col-span-6 flex justify-end items-end gap-3">
							<div className="w-56 space-y-1">
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
					)}
				</div>

				<Separator className="my-4" />

				{/* CONTENT AREA */}
				{isRombelsLoading ? (
					<BaseLoading />
				) : !selectedRombel ? (
					/* MAIN VIEW: CLASS CARDS GRID (FULL MATCH TO /rekap/bulanan) */
					<div className="space-y-6">
						{/* Summary Banner */}
						<div className="flex flex-wrap justify-between items-center gap-4 bg-muted p-4 rounded-lg">
							<div className="flex items-center gap-2 font-medium text-sm">
								<span>Periode: {monthsList.find((m) => m.value === month)?.label} {year}</span>
							</div>
							<div className="flex flex-wrap gap-3">
								<Badge variant="outline" className="text-sm">
									Total Kelas: {rombels?.length || 0}
								</Badge>
							</div>
						</div>

						{sortedGrades.map((grade) => (
							<div key={grade} className="space-y-4">
								<h2 className="font-medium text-xl">Kelas {grade}</h2>
								<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
									{groupedRombels[grade]?.map((rombel) => {
										const waliName =
											typeof rombel.wali_kelas === "object"
												? rombel.wali_kelas?.fullname
												: typeof rombel.wali_kelas === "string"
													? rombel.wali_kelas
													: "Wali Kelas";

										return (
											<Card
												key={rombel.id}
												onClick={() => setSelectedRombel(rombel.id)}
												className="hover:shadow-md h-full hover:scale-95 transition duration-300 cursor-pointer border"
											>
												<CardHeader className="pb-2">
													<CardTitle className="flex justify-between items-center text-lg">
														<span>{rombel.nama}</span>
														<Badge variant="secondary" className="text-xs font-normal">
															Tingkat {rombel.tingkat_kelas}
														</Badge>
													</CardTitle>
													<CardDescription>
														{typeof rombel.jurusan === "object"
															? rombel.jurusan?.nama || rombel.jurusan?.kode || "Presensi Apel Pagi"
															: rombel.jurusan || "Presensi Apel Pagi"}
													</CardDescription>
												</CardHeader>
												<CardContent>
													<div className="space-y-2">
														<div className="flex items-center gap-2 text-muted-foreground text-xs">
															<User className="w-4 h-4" />
															<span>{waliName}</span>
														</div>
														<div className="flex items-center gap-2 text-muted-foreground text-xs">
															<IconUsers className="w-4 h-4" />
															<span>Klik untuk buka rekap detail siswa</span>
														</div>
													</div>
												</CardContent>
											</Card>
										);
									})}
								</div>
							</div>
						))}
					</div>
				) : (
					/* DETAIL VIEW (FULL MATCH TO /rekap/bulanan/[rombelId]) */
					<div className="space-y-5">
						<div className="flex flex-row justify-between items-start gap-4">
							<div className="space-y-1">
								<h2 className="font-semibold text-2xl tracking-tight text-primary">
									{monthlyData?.rombel || selectedRombelObj?.nama || "Rombel"}
								</h2>
								<p className="text-muted-foreground text-sm font-medium">
									{(typeof selectedRombelObj?.jurusan === "object"
										? selectedRombelObj?.jurusan?.nama || selectedRombelObj?.jurusan?.kode
										: selectedRombelObj?.jurusan) || "Presensi Apel Pagi"}{" "}
									| {monthsList.find((m) => m.value === month)?.label} {year}
								</p>
							</div>
						</div>

						{/* Summary Stats Badges */}
						<div className="flex flex-wrap gap-4 mb-2">
							<Badge variant="outline" className="px-3 py-1 text-sm">
								Total Siswa: {studentKeys.length}
							</Badge>
							<Badge variant="outline" className="px-3 py-1 text-sm">
								Total Hari Sesi: {daysInMonth} Hari
							</Badge>
						</div>

						{/* Students Table matching /rekap/bulanan/[rombelId] */}
						<Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-xs">
							<CardHeader className="bg-muted/30">
								<CardTitle className="text-xl">Daftar Siswa</CardTitle>
								<CardDescription>
									Detail statistik dan rekap kehadiran apel siswa per bulan
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
										Tidak ada data presensi siswa untuk kelas ini pada bulan {monthsList.find((m) => m.value === month)?.label} {year}.
									</div>
								) : viewType === "ringkasan" ? (
									/* SUMMARY STUDENT TABLE (EXACT MATCH TO /rekap/bulanan/[rombelId]) */
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
												</TableRow>
											</TableHeader>
											<TableBody>
												{studentStatsList.map((st, index) => (
													<TableRow key={st.stId} className="hover:bg-muted/80 transition-colors">
														<TableCell className="px-4 text-xs font-medium text-muted-foreground">{index + 1}</TableCell>
														<TableCell>
															<div className="flex items-center gap-3">
																<Avatar className="w-9 h-9 border-2 border-background shadow-xs">
																	<AvatarImage src={st.photo} alt={st.studentName} />
																	<AvatarFallback className="bg-primary/10 text-primary font-bold">
																		{st.studentName.charAt(0).toUpperCase()}
																	</AvatarFallback>
																</Avatar>
																<span className="font-semibold text-sm">{st.studentName}</span>
															</div>
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
														<TableCell className="font-bold text-center text-xs">{st.totalDays}</TableCell>
														<TableCell className="text-center">{getAttendanceRateBadge(st.rate)}</TableCell>
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
															{st.studentName}
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
				)}
			</div>
		</div>
	);
}
