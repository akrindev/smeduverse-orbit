"use client";

import BaseLoading from "@/components/base-loading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRombelsQuery } from "@/queries/useRombelQuery";
import { IconUsers } from "@tabler/icons-react";
import { User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export default function PresensiSiswaRekapMainPage() {
	const searchParams = useSearchParams();
	const currentDate = new Date();
	const initialMonth = Number(searchParams.get("month")) || currentDate.getMonth() + 1;
	const initialYear = Number(searchParams.get("year")) || currentDate.getFullYear();

	const [month, setMonth] = useState(initialMonth);
	const [year, setYear] = useState(initialYear);

	const { data: rombels, isLoading: isRombelsLoading } = useRombelsQuery();

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

	const monthName = monthsList.find((m) => m.value === month)?.label;

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
				</div>

				<Separator className="my-4" />

				{/* CONTENT AREA */}
				{isRombelsLoading ? (
					<BaseLoading />
				) : (
					<div className="space-y-6">
						{/* Summary Banner */}
						<div className="flex flex-wrap justify-between items-center gap-4 bg-muted p-4 rounded-lg">
							<div className="flex items-center gap-2 font-medium text-sm">
								<span>Periode: {monthName} {year}</span>
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
									{groupedRombels[grade]?.map((rombel) => (
										<RombelApelCard
											key={rombel.id}
											rombel={rombel}
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

function RombelApelCard({
	rombel,
	month,
	year,
}: {
	rombel: any;
	month: number;
	year: number;
}) {
	const waliName =
		typeof rombel.wali_kelas === "object"
			? rombel.wali_kelas?.fullname
			: typeof rombel.wali_kelas === "string"
				? rombel.wali_kelas
				: "Wali Kelas";

	const jurusanNama =
		typeof rombel.jurusan === "object"
			? rombel.jurusan?.nama || rombel.jurusan?.kode || "Presensi Apel Pagi"
			: rombel.jurusan || "Presensi Apel Pagi";

	return (
		<Link href={`/presensi-siswa/rekap/${rombel.id}?month=${month}&year=${year}`}>
			<Card className="hover:shadow-md h-full hover:scale-95 transition duration-300 cursor-pointer border">
				<CardHeader className="pb-2">
					<CardTitle className="flex justify-between items-center text-lg">
						<span>{rombel.nama}</span>
						<Badge variant="secondary" className="text-xs font-normal">
							Tingkat {rombel.tingkat_kelas}
						</Badge>
					</CardTitle>
					<CardDescription>{jurusanNama}</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<User className="w-4 h-4" />
							<span>{waliName}</span>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<IconUsers className="w-4 h-4" />
							<span>Buka rekap kelas</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
