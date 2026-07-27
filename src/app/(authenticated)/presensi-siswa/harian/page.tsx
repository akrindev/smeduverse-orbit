"use client";

import { Calendar as CalendarIcon, Filter, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteApelAttendanceMutation, useLatestApelAttendanceQuery } from "@/queries/useApelAttendanceQuery";
import { useRombelsQuery } from "@/queries/useRombelQuery";

export default function PresensiSiswaHarianPage() {
	const todayDate = new Date().toISOString().split("T")[0];
	const [selectedDate, setSelectedDate] = useState<string>(todayDate);
	const [selectedRombel, setSelectedRombel] = useState<string>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const { data: rombels } = useRombelsQuery();
	const deleteMutation = useDeleteApelAttendanceMutation();

	const {
		data: attendanceData,
		isLoading,
		isRefetching,
		refetch,
	} = useLatestApelAttendanceQuery({
		date: selectedDate,
		rombel_id: selectedRombel === "all" ? undefined : selectedRombel,
		page: currentPage,
	});

	const rawList = attendanceData?.attendances?.data ?? [];
	const pagination = attendanceData?.attendances;

	// Filter list locally by search query
	const filteredList = rawList.filter((att) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		const fullname = att.student?.fullname?.toLowerCase() || "";
		const nipd = att.student?.nipd?.toLowerCase() || "";
		const studentId = att.student_id?.toLowerCase() || "";
		return fullname.includes(query) || nipd.includes(query) || studentId.includes(query);
	});

	const handleDelete = async () => {
		if (!deletingId) return;
		try {
			await deleteMutation.mutateAsync(deletingId);
			toast.success("Data presensi berhasil dihapus");
			setDeletingId(null);
		} catch (err: any) {
			toast.error(err?.response?.data?.message || "Gagal menghapus data presensi");
		}
	};

	return (
		<div className="space-y-6">
			{/* Filters Card */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<CardTitle className="text-base">Filter Presensi Harian</CardTitle>
							<CardDescription className="text-xs">
								Pilih tanggal dan rombel untuk menampilkan data kehadiran
							</CardDescription>
						</div>
						<Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading || isRefetching}>
							<RefreshCw className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{/* Date Picker Input */}
						<div className="space-y-1.5">
							<label htmlFor="date-picker-input" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<CalendarIcon className="w-3.5 h-3.5" /> Tanggal Presensi
							</label>
							<Input
								id="date-picker-input"
								type="date"
								value={selectedDate}
								onChange={(e) => {
									setSelectedDate(e.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>

						{/* Rombel Select */}
						<div className="space-y-1.5">
							<label htmlFor="rombel-filter-select" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Filter className="w-3.5 h-3.5" /> Rombongan Belajar
							</label>
							<Select
								value={selectedRombel}
								onValueChange={(val) => {
									setSelectedRombel(val);
									setCurrentPage(1);
								}}
							>
								<SelectTrigger id="rombel-filter-select">
									<SelectValue placeholder="Semua Rombel" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Semua Rombel</SelectItem>
									{rombels?.map((rombel) => (
										<SelectItem key={rombel.id} value={rombel.id}>
											{rombel.nama}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Search Input */}
						<div className="space-y-1.5">
							<label htmlFor="search-input" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
								<Search className="w-3.5 h-3.5" /> Cari Siswa / NIS
							</label>
							<div className="relative">
								<Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
								<Input
									id="search-input"
									placeholder="Nama / NIS..."
									className="pl-9"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Table Card */}
			<Card className="shadow-xs">
				<CardHeader className="pb-3 flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-base">Daftar Kehadiran Apel</CardTitle>
						<CardDescription className="text-xs">
							Tanggal: {new Date(selectedDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
						</CardDescription>
					</div>
					<Badge variant="secondary" className="text-xs">
						Total: {pagination?.total ?? filteredList.length} Siswa
					</Badge>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-3">
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-full h-10" />
						</div>
					) : filteredList.length === 0 ? (
						<div className="py-12 text-center text-muted-foreground text-sm border border-dashed rounded-md">
							Tidak ada data kehadiran apel pada tanggal dan filter terpilih.
						</div>
					) : (
						<div className="border rounded-md overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[60px]">No</TableHead>
										<TableHead>Nama Siswa</TableHead>
										<TableHead>NIS / NIPD</TableHead>
										<TableHead>Rombel</TableHead>
										<TableHead>Waktu Scan</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Aksi</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredList.map((att, idx) => (
										<TableRow key={att.id}>
											<TableCell className="font-medium text-xs">
												{((pagination?.current_page ?? 1) - 1) * (pagination?.per_page ?? 15) + idx + 1}
											</TableCell>
											<TableCell className="font-semibold text-sm">
												{att.student?.fullname || att.student_id}
											</TableCell>
											<TableCell className="text-xs font-mono">{att.student?.nipd || "-"}</TableCell>
											<TableCell className="text-xs">{att.rombel?.nama || "-"}</TableCell>
											<TableCell className="text-xs">
												{new Date(att.attendance_date).toLocaleTimeString("id-ID", {
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit",
												})}
											</TableCell>
											<TableCell>
												<Badge className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 text-xs">
													Hadir
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-destructive hover:bg-destructive/10"
													onClick={() => setDeletingId(att.id)}
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}

					{/* Pagination Controls */}
					{pagination && pagination.last_page > 1 && (
						<div className="flex items-center justify-between mt-4">
							<p className="text-xs text-muted-foreground">
								Halaman {pagination.current_page} dari {pagination.last_page}
							</p>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									disabled={currentPage <= 1}
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								>
									Sebelumnya
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={currentPage >= pagination.last_page}
									onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))}
								>
									Selanjutnya
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Confirmation Delete Dialog */}
			<AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus Data Presensi?</AlertDialogTitle>
						<AlertDialogDescription>
							Tindakan ini akan menghapus catatan presensi apel siswa ini secara permanen.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
