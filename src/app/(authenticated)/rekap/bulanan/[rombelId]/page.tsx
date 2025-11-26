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
import { useMonthlyRecapMutation } from "@/queries/useExportQuery";
import type { MonthlyRecapResponse } from "@/types/monthly-recap";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function RekapBulananDetailPage() {
	const params = useParams<{ rombelId: string }>();
	const rombelId = useMemo(() => params?.rombelId ?? "", [params]);
	const searchParams = useSearchParams();
	const month = Number(searchParams.get("month")) || new Date().getMonth() + 1;
	const year = Number(searchParams.get("year")) || new Date().getFullYear();

	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState<MonthlyRecapResponse | null>(null);

	const monthlyRecapMutation = useMonthlyRecapMutation();

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

				<div className="flex md:flex-row flex-col justify-between">
					<div className="space-y-1 mt-2">
						<h2 className="font-semibold text-2xl tracking-tight">
							{data.meta.rombel_nama}
						</h2>
						<p className="text-muted-foreground text-sm">
							{data.meta.jurusan} | {data.meta.period}
						</p>
					</div>
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
				<Card>
					<CardHeader>
						<CardTitle>Daftar Siswa</CardTitle>
						<CardDescription>
							Klik pada siswa untuk melihat detail kehadiran
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-12">No</TableHead>
									<TableHead>Siswa</TableHead>
									<TableHead className="text-center">NIS</TableHead>
									<TableHead className="text-center">H</TableHead>
									<TableHead className="text-center">S</TableHead>
									<TableHead className="text-center">I</TableHead>
									<TableHead className="text-center">A</TableHead>
									<TableHead className="text-center">B</TableHead>
									<TableHead className="text-center">Total</TableHead>
									<TableHead className="text-center">%</TableHead>
									<TableHead className="w-12"></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.students.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={11}
											className="py-8 text-muted-foreground text-center"
										>
											Tidak ada data siswa
										</TableCell>
									</TableRow>
								) : (
									data.students.map((student, index) => (
										<TableRow
											key={student.student_id}
											className="hover:bg-muted/50 cursor-pointer"
										>
											<TableCell>{index + 1}</TableCell>
											<TableCell>
												<Link
													href={`/rekap/bulanan/${rombelId}/siswa/${student.student_id}?month=${month}&year=${year}`}
													className="flex items-center gap-3"
												>
													<Avatar className="w-8 h-8">
														<AvatarImage
															src={student.photo}
															alt={student.fullname}
														/>
														<AvatarFallback>
															{student.fullname.charAt(0).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<span className="font-medium hover:underline">
														{student.fullname}
													</span>
												</Link>
											</TableCell>
											<TableCell className="text-center">
												{student.nipd}
											</TableCell>
											<TableCell className="text-center">
												<Badge className="bg-green-500 hover:bg-green-600">
													{student.count_h}
												</Badge>
											</TableCell>
											<TableCell className="text-center">
												<Badge className="bg-blue-500 hover:bg-blue-600">
													{student.count_s}
												</Badge>
											</TableCell>
											<TableCell className="text-center">
												<Badge className="bg-purple-500 hover:bg-purple-600">
													{student.count_i}
												</Badge>
											</TableCell>
											<TableCell className="text-center">
												<Badge className="bg-orange-500 hover:bg-orange-600">
													{student.count_a}
												</Badge>
											</TableCell>
											<TableCell className="text-center">
												<Badge className="bg-red-500 hover:bg-red-600">
													{student.count_b}
												</Badge>
											</TableCell>
											<TableCell className="font-medium text-center">
												{student.total_days}
											</TableCell>
											<TableCell className="text-center">
												{getAttendanceRateBadge(student.attendance_rate)}
											</TableCell>
											<TableCell>
												<Link
													href={`/rekap/bulanan/${rombelId}/siswa/${student.student_id}?month=${month}&year=${year}`}
												>
													<IconChevronRight className="w-4 h-4 text-muted-foreground" />
												</Link>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
