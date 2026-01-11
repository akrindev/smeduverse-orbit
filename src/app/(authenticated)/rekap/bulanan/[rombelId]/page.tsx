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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    useExportMonthlyRecapMutation,
    useMonthlyRecapMutation,
} from "@/queries/useExportQuery";
import type { MonthlyRecapResponse } from "@/types/monthly-recap";
import {
    IconArrowLeft,
    IconChevronRight,
    IconDownload,
} from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function RekapBulananDetailPage() {
	const params = useParams<{ rombelId: string }>();
	const rombelId = useMemo(() => params?.rombelId ?? "", [params]);
	const searchParams = useSearchParams();
	const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
	const year = Number(searchParams.get("year")) || new Date().getFullYear();

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<MonthlyRecapResponse | null>(null);

	const monthlyRecapMutation = useMonthlyRecapMutation();
	const exportMonthlyRecapMutation = useExportMonthlyRecapMutation();

	useEffect(() => {
		if (!rombelId) return;
		setIsLoading(true);
		monthlyRecapMutation
			.mutateAsync({
				rombel_id: rombelId,
				month,
				year,
			})
			.then((res) => setData(res))
			.catch((err) => {
				console.error("Error fetching class detail:", err);
				setData(null);
			})
			.finally(() => setIsLoading(false));
	}, [rombelId, month, year, monthlyRecapMutation.mutateAsync]);

	const handleExport = async () => {
		try {
			const blob = await exportMonthlyRecapMutation.mutateAsync({
				rombel_id: rombelId,
				month,
				year,
			});

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `rekap-bulanan-${data?.meta.rombel_nama}-${month}-${year}.xlsx`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);

			toast.success("Berhasil mengunduh rekap bulanan");
		} catch (error) {
			console.error("Error exporting monthly recap:", error);
			toast.error("Gagal mengunduh rekap bulanan");
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

	if (!data) {
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
							<p className="text-muted-foreground">Gagal memuat data</p>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!rombelId) {
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
							<p className="text-muted-foreground">Kelas tidak ditemukan</p>
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
					<Link href={`/rekap/bulanan?month=${month}&year=${year}`}>
						<IconArrowLeft className="mr-2 w-4 h-4" />
						Kembali ke Rekap Bulanan
					</Link>
				</Button>

				<div className="flex flex-row justify-between items-start gap-4">
					<div className="space-y-1 mt-2">
						<h2 className="font-semibold text-2xl tracking-tight text-primary">
							{data.meta.rombel_nama}
						</h2>
						<p className="text-muted-foreground text-sm font-medium">
							{data.meta.jurusan} | {data.meta.period}
						</p>
					</div>
					<Button
						onClick={handleExport}
						disabled={exportMonthlyRecapMutation.isPending}
						className="mt-2 bg-green-600 hover:bg-green-700 text-white shadow-xs transition-all flex items-center gap-2"
					>
						{exportMonthlyRecapMutation.isPending ? (
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
						) : (
							<IconDownload className="w-4 h-4" />
						)}
						Unduh Excel
					</Button>
				</div>
				<Separator className="my-4" />

				{/* Summary stats */}
				<div className="flex flex-wrap gap-4 mb-4">
					<Badge variant="outline" className="px-3 py-1 text-sm">
						Total Siswa: {data.meta.total_students}
					</Badge>
					<Badge variant="outline" className="px-3 py-1 text-sm">
						Total Hari Sesi: {data.meta.total_session_days}
					</Badge>
				</div>

				{/* Students Table */}
				<Card className="border-none shadow-md overflow-hidden bg-card/50 backdrop-blur-xs">
					<CardHeader className="bg-muted/30">
						<CardTitle className="text-xl">Daftar Siswa</CardTitle>
						<CardDescription>
							Klik pada siswa untuk melihat detail kehadiran
						</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
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
										<TableHead className="text-center font-bold">B</TableHead>
										<TableHead className="text-center font-bold">
											Total
										</TableHead>
										<TableHead className="text-center font-bold">%</TableHead>
										<TableHead className="w-12"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.students.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={11}
												className="py-12 text-muted-foreground text-center italic"
											>
												Tidak ada data siswa
											</TableCell>
										</TableRow>
									) : (
										data.students.map((student, index) => (
											<TableRow
												key={student.student_id}
												className="hover:bg-muted/80 cursor-pointer group transition-colors"
											>
												<TableCell className="px-4">{index + 1}</TableCell>
												<TableCell>
													<Link
														href={`/rekap/bulanan/${rombelId}/siswa/${student.student_id}?month=${month}&year=${year}`}
														className="flex items-center gap-3"
													>
														<Avatar className="w-9 h-9 border-2 border-background shadow-xs">
															<AvatarImage
																src={student.photo}
																alt={student.fullname}
															/>
															<AvatarFallback className="bg-primary/10 text-primary font-bold">
																{student.fullname.charAt(0).toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div className="flex flex-col">
															<span className="font-semibold group-hover:text-primary transition-colors">
																{student.fullname}
															</span>
														</div>
													</Link>
												</TableCell>
												<TableCell className="text-center font-mono text-xs">
													{student.nipd}
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-xs border-none">
														{student.count_h}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-sky-500 hover:bg-sky-600 shadow-xs border-none">
														{student.count_s}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-indigo-500 hover:bg-indigo-600 shadow-xs border-none">
														{student.count_i}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-amber-500 hover:bg-amber-600 shadow-xs border-none">
														{student.count_a}
													</Badge>
												</TableCell>
												<TableCell className="text-center">
													<Badge className="bg-rose-500 hover:bg-rose-600 shadow-xs border-none">
														{student.count_b}
													</Badge>
												</TableCell>
												<TableCell className="font-bold text-center">
													{student.total_days}
												</TableCell>
												<TableCell className="text-center">
													{getAttendanceRateBadge(student.attendance_rate)}
												</TableCell>
												<TableCell>
													<Link
														href={`/rekap/bulanan/${rombelId}/siswa/${student.student_id}?month=${month}&year=${year}`}
													>
														<IconChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
													</Link>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
