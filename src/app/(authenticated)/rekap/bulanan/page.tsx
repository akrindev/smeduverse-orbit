"use client";

import BaseLoading from "@/components/base-loading";
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
	useExportMonthlyRecapAllMutation,
	useMonthlyRecapAllMutation,
} from "@/queries/useExportQuery";
import type {
	ClassRecap,
	MonthlyRecapAllResponse,
} from "@/types/monthly-recap";
import { IconDownload, IconUsers } from "@tabler/icons-react";
import { Loader2, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MonthYearSelector from "./components/month-year-selector";

export default function RekapBulananPage() {
	const currentDate = new Date();
	const [month, setMonth] = useState(currentDate.getMonth() + 1);
	const [year, setYear] = useState(currentDate.getFullYear());
	const [isLoading, setIsLoading] = useState(false);
	const [exportLoading, setExportLoading] = useState(false);
	const [data, setData] = useState<MonthlyRecapAllResponse | null>(null);

	const monthlyRecapAllMutation = useMonthlyRecapAllMutation();
	const exportMonthlyRecapAllMutation = useExportMonthlyRecapAllMutation();

	// Fetch data when filters change
	useEffect(() => {
		setIsLoading(true);
		monthlyRecapAllMutation
			.mutateAsync({
				month,
				year,
			})
			.then((res) => setData(res))
			.catch((err) => {
				console.error("Error fetching monthly recap:", err);
				setData(null);
			})
			.finally(() => setIsLoading(false));
	}, [month, year, monthlyRecapAllMutation.mutateAsync]);

	// Group classes by grade level
	const groupedClasses = useMemo(() => {
		if (!data?.classes) return {};
		return data.classes.reduce(
			(acc, cls) => {
				const grade = cls.tingkat_kelas;
				if (!acc[grade]) acc[grade] = [];
				acc[grade].push(cls);
				return acc;
			},
			{} as Record<number, ClassRecap[]>,
		);
	}, [data?.classes]);

	// Sort grade levels
	const sortedGrades = useMemo(() => {
		return Object.keys(groupedClasses)
			.map(Number)
			.sort((a, b) => a - b);
	}, [groupedClasses]);

	const handleExport = async () => {
		try {
			setExportLoading(true);
			const blob = await exportMonthlyRecapAllMutation.mutateAsync({
				month,
				year,
			});

			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement("a");
			link.href = url;
			const filename = `rekap-bulanan-semua-kelas-${month}-${year}.xlsx`;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error exporting monthly recap:", error);
		} finally {
			setExportLoading(false);
		}
	};

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				<div className="flex md:flex-row flex-col justify-between">
					<div className="space-y-1 mt-5">
						<h2 className="font-semibold text-2xl tracking-tight">
							Rekap Kehadiran Bulanan
						</h2>
						<p className="text-muted-foreground text-sm">
							Rekap kehadiran siswa per bulan berdasarkan kelas
						</p>
					</div>
					<div className="flex items-end mt-4 md:mt-0">
						<Button
							onClick={handleExport}
							disabled={exportLoading || !data}
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
				<div className="gap-5 grid grid-cols-12">
					<div className="col-span-12 md:col-span-6">
						<MonthYearSelector
							month={month}
							year={year}
							onMonthChange={setMonth}
							onYearChange={setYear}
						/>
					</div>
				</div>
				<Separator className="my-4" />

				{isLoading ? (
					<BaseLoading />
				) : !data ? (
					<Card>
						<CardContent className="py-10 text-center">
							<p className="text-muted-foreground">
								Gagal memuat data rekap bulanan
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-6">
						{/* Summary Header */}
						<div className="flex flex-wrap justify-between items-center gap-4 bg-muted p-4 rounded-lg">
							<div className="flex items-center gap-2">
								<span className="font-medium">Periode: {data.meta.period}</span>
							</div>
							<div className="flex flex-wrap gap-4">
								<Badge variant="outline" className="text-sm">
									Total Kelas: {data.meta.total_classes}
								</Badge>
								<Badge variant="outline" className="text-sm">
									Total Siswa: {data.meta.total_students}
								</Badge>
							</div>
						</div>

						{/* Classes grouped by grade */}
						{sortedGrades.map((grade) => (
							<div key={grade} className="space-y-4">
								<h2 className="font-medium text-xl">Kelas {grade}</h2>
								<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
									{groupedClasses[grade].map((cls) => (
										<ClassCard
											key={cls.rombel_id}
											classData={cls}
											month={month}
											year={year}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

// Component for displaying a single class card
function ClassCard({
	classData,
	month,
	year,
}: {
	classData: ClassRecap;
	month: number;
	year: number;
}) {
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

	return (
		<Link
			href={`/rekap/bulanan/${classData.rombel_id}?month=${month}&year=${year}`}
		>
			<Card className="hover:shadow-md h-full hover:scale-95 transition duration-300 cursor-pointer">
				<CardHeader className="pb-2">
					<CardTitle className="flex justify-between text-lg">
						<span>{classData.rombel_nama}</span>
						{classData.attendance_rate > 0 &&
							getAttendanceRateBadge(classData.attendance_rate)}
					</CardTitle>
					<CardDescription>{classData.jurusan}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<User className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm">{classData.wali_kelas}</span>
						</div>
						<div className="flex items-center gap-2">
							<IconUsers className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm">{classData.total_students} siswa</span>
						</div>

						{/* Attendance stats */}
						<div className="mt-3 pt-2 border-t">
							<div className="mb-2 font-medium text-sm">
								Statistik Kehadiran:
							</div>
							<div className="gap-1 grid grid-cols-5">
								<Badge
									variant="outline"
									className="flex flex-col items-center p-1 border-green-300 dark:border-green-700"
								>
									<span className="font-bold text-green-600">
										H: {classData.count_h}
									</span>
									{/* <span className="text-xs">H</span> */}
								</Badge>
								<Badge
									variant="outline"
									className="flex flex-col items-center p-1 border-blue-300 dark:border-blue-700"
								>
									<span className="font-bold text-blue-600">
										S: {classData.count_s}
									</span>
									{/* <span className="text-xs">S</span> */}
								</Badge>
								<Badge
									variant="outline"
									className="flex flex-col items-center p-1 border-purple-300 dark:border-purple-700"
								>
									<span className="font-bold text-purple-600">
										I: {classData.count_i}
									</span>
									{/* <span className="text-xs">I</span> */}
								</Badge>
								<Badge
									variant="outline"
									className="flex flex-col items-center p-1 border-orange-300 dark:border-orange-700"
								>
									<span className="font-bold text-orange-600">
										A: {classData.count_a}
									</span>
									{/* <span className="text-xs">A</span> */}
								</Badge>
								<Badge
									variant="outline"
									className="flex flex-col items-center p-1 border-red-300 dark:border-red-700"
								>
									<span className="font-bold text-red-600">
										B: {classData.count_b}
									</span>
									{/* <span className="text-xs">B</span> */}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
