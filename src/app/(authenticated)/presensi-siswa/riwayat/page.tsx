"use client";

import { Calendar, History, Search, User } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStudentApelHistoryQuery } from "@/queries/useApelAttendanceQuery";

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

export default function PresensiSiswaRiwayatPage() {
	const currentDate = new Date();
	const [studentInput, setStudentInput] = useState<string>("");
	const [activeStudentId, setActiveStudentId] = useState<string>("");
	const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
	const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

	const { data: historyData, isLoading, isRefetching } = useStudentApelHistoryQuery({
		student_id: activeStudentId,
		month: selectedMonth,
		year: selectedYear,
	});

	const records = historyData?.attendances ?? [];
	const studentInfo = records[0]?.student;

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (studentInput.trim()) {
			setActiveStudentId(studentInput.trim());
		}
	};

	return (
		<div className="space-y-6">
			{/* Search & Filter Section */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Pencarian Riwayat Siswa</CardTitle>
					<CardDescription className="text-xs">
						Masukkan Student ID atau NIS siswa dan pilih periode untuk menampilkan riwayat presensi apel
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
						<div className="sm:col-span-2 space-y-1.5">
							<label htmlFor="student-id-input" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<User className="w-3.5 h-3.5" /> ID Siswa / NIS
							</label>
							<div className="flex gap-2">
								<Input
									id="student-id-input"
									placeholder="Contoh: STU001..."
									value={studentInput}
									onChange={(e) => setStudentInput(e.target.value)}
								/>
								<Button type="submit">
									<Search className="w-4 h-4 mr-1" /> Cari
								</Button>
							</div>
						</div>

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
					</form>
				</CardContent>
			</Card>

			{/* Results Section */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3 flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Riwayat Kehadiran Apel</CardTitle>
						<CardDescription className="text-xs">
							{studentInfo
								? `Siswa: ${studentInfo.fullname} (${studentInfo.nipd})`
								: activeStudentId
									? `ID Siswa: ${activeStudentId}`
									: "Belum memilih siswa"}
						</CardDescription>
					</div>
					{activeStudentId && (
						<Badge variant="outline" className="text-xs">
							{records.length} Record Kehadiran
						</Badge>
					)}
				</CardHeader>
				<CardContent>
					{!activeStudentId ? (
						<div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Ketikkan ID Siswa atau NIS pada form di atas lalu klik Cari.
						</div>
					) : isLoading || isRefetching ? (
						<div className="space-y-3">
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
						</div>
					) : records.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Belum ada data kehadiran apel bulan ini untuk ID Siswa: {activeStudentId}.
						</div>
					) : (
						<div className="border rounded-md overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[60px]">No</TableHead>
										<TableHead>Tanggal Presensi</TableHead>
										<TableHead>Waktu</TableHead>
										<TableHead>Rombel</TableHead>
										<TableHead>Tipe Presensi</TableHead>
										<TableHead className="text-right">Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{records.map((rec, idx) => {
										const dt = new Date(rec.attendance_date);
										return (
											<TableRow key={rec.id}>
												<TableCell className="font-medium text-xs">{idx + 1}</TableCell>
												<TableCell className="font-semibold text-sm">
													{dt.toLocaleDateString("id-ID", {
														weekday: "long",
														year: "numeric",
														month: "long",
														day: "numeric",
													})}
												</TableCell>
												<TableCell className="text-xs">
													{dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
												</TableCell>
												<TableCell className="text-xs">{rec.rombel?.nama || "-"}</TableCell>
												<TableCell className="text-xs capitalize">{rec.attendance_type || "apel"}</TableCell>
												<TableCell className="text-right">
													<Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 text-xs">
														Hadir
													</Badge>
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
