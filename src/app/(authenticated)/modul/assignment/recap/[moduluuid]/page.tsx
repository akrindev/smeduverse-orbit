"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAssignmentRecapQuery } from "@/queries/useAssignmentQuery";

interface StudentAssignmentData {
	student_id: string;
	fullname: string;
	nipd: string;
	nisn: string;
	photo: string;
	assignment_stats: {
		total_assignments: number;
		submitted_count: number;
		graded_count: number;
		average_grade: number | null;
		highest_grade: number | null;
		lowest_grade: number | null;
		submission_rate: number;
	};
	orbit_assignment_sheets: Array<{
		uuid: string;
		orbit_assignment_uuid: string;
		student_id: string;
		notes: string | null;
		grade: number | null;
		created_at: string;
		updated_at: string;
		assignment: {
			uuid: string;
			orbit_modul_uuid: string;
			title: string;
			body: string;
			teacher_id: string;
			kkm_value: number;
			date: string;
			due_date: string;
			created_at: string;
			updated_at: string;
			deleted_at: string | null;
		};
	}>;
}

export default function AssignmentRecapPage() {
	const { moduluuid } = useParams<{ moduluuid: string }>();

	const {
		data: recapData,
		isLoading,
		error,
	} = useAssignmentRecapQuery(moduluuid);

	if (isLoading) {
		return <BaseLoading />;
	}

	if (error) {
		return (
			<div className="flex flex-col space-y-5 h-full">
				<div className="flex flex-col h-full">
					<div className="flex md:flex-row flex-col justify-between">
						<div className="space-y-1 mt-5">
							<h2 className="font-semibold text-2xl tracking-tight">Error</h2>
							<p className="text-muted-foreground text-sm">
								Terjadi kesalahan saat memuat data rekap tugas
							</p>
						</div>
					</div>
					<Separator className="my-4" />
					<Card>
						<CardContent className="flex justify-center items-center py-12">
							<div className="text-center">
								<div className="font-semibold text-xl">Error</div>
								<div className="text-muted-foreground">
									Gagal memuat data rekap tugas
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const studentData = Array.isArray(recapData?.data)
		? (recapData.data as StudentAssignmentData[])
		: Array.isArray(recapData)
			? (recapData as StudentAssignmentData[])
			: [];

	// Debug logging
	console.log("Raw API Response:", recapData);
	console.log("Processed studentData:", studentData);
	console.log("studentData length:", studentData.length);

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				<div className="flex md:flex-row flex-col justify-between">
					<div className="space-y-1 mt-5">
						<h2 className="font-semibold text-2xl tracking-tight">
							Rekap Tugas Siswa
						</h2>
						<p className="text-muted-foreground text-sm">
							Rekapitulasi pengumpulan dan penilaian tugas siswa
						</p>
					</div>
				</div>
				<Separator className="my-4" />
				<Card>
					<CardHeader>
						<CardTitle>Rekap Tugas Modul</CardTitle>
						<CardDescription>
							{studentData && studentData.length > 0
								? `Daftar rekap tugas (${studentData.length} siswa)`
								: "Tidak ada data tugas"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{studentData && studentData.length > 0 ? (
							<StudentAssignmentRecapTable data={studentData} />
						) : (
							<div className="flex flex-col justify-center items-center py-12">
								<div className="font-semibold text-xl">Tidak ada data</div>
								<div className="text-muted-foreground">
									Tidak ada data rekap tugas untuk modul ini
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

interface StudentAssignmentRecapTableProps {
	data: StudentAssignmentData[];
}

function StudentAssignmentRecapTable({
	data,
}: StudentAssignmentRecapTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [globalFilter, setGlobalFilter] = useState("");

	const getGradeColor = useCallback((grade: number | null) => {
		if (!grade) return "text-muted-foreground";
		if (grade >= 80) return "text-green-600 font-medium";
		if (grade >= 60) return "text-yellow-600 font-medium";
		return "text-red-600 font-medium";
	}, []);

	const getGradingStatusColor = useCallback(
		(graded: number, submitted: number) => {
			if (submitted === 0) return "bg-gray-100 text-gray-800 border-gray-200";
			const rate = (graded / submitted) * 100;
			if (rate === 100) return "bg-green-100 text-green-800 border-green-200";
			if (rate >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-200";
			return "bg-red-100 text-red-800 border-red-200";
		},
		[],
	);

	const columns: ColumnDef<StudentAssignmentData>[] = useMemo(
		() => [
			{
				accessorKey: "fullname",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="p-0 h-auto font-medium"
					>
						Siswa
						<ArrowUpDown className="ml-2 w-4 h-4" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="flex items-center space-x-3">
						<Avatar className="w-10 h-10">
							<AvatarImage
								src={row.original.photo}
								alt={row.original.fullname}
							/>
							<AvatarFallback>
								{row.original.fullname
									.split(" ")
									.map((n) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{row.original.fullname}</div>
							<div className="text-muted-foreground text-sm">
								{row.original.nipd}
							</div>
						</div>
					</div>
				),
				filterFn: (row, id, value) => {
					const fullname = row.original.fullname.toLowerCase();
					const nipd = row.original.nipd.toLowerCase();
					return (
						fullname.includes(value.toLowerCase()) ||
						nipd.includes(value.toLowerCase())
					);
				},
			},
			// {
			// 	accessorKey: "assignment_stats",
			// 	header: "Statistik Tugas",
			// 	cell: ({ row }) => {
			// 		const stats = row.original.assignment_stats;
			// 		return (
			// 			<div className="space-y-1 text-sm">
			// 				<div>Total: {stats.total_assignments}</div>
			// 				<div>Dikumpulkan: {stats.submitted_count}</div>
			// 				<div>Dinilai: {stats.graded_count}</div>
			// 			</div>
			// 		);
			// 	},
			// },
			{
				accessorKey: "orbit_assignment_sheets",
				header: "Detail Tugas",
				cell: ({ row }) => {
					const assignments = row.original.orbit_assignment_sheets;
					if (!assignments || assignments.length === 0) {
						return (
							<div className="text-muted-foreground text-sm">
								Tidak ada tugas
							</div>
						);
					}

					return (
						<div className="space-y-1 max-w-md">
							{assignments.map((assignment) => (
								<div key={assignment.uuid} className="text-md">
									<div className="flex justify-between items-center">
										<span className="truncate">
											{assignment.assignment.title}
										</span>
										{assignment.grade !== null ? (
											<span
												className={`font-medium ${getGradeColor(assignment.grade)}`}
											>
												{assignment.grade}
											</span>
										) : (
											<span className="text-muted-foreground">-</span>
										)}
									</div>
									{assignment.notes && (
										<div className="text-muted-foreground text-xs truncate">
											{assignment.notes}
										</div>
									)}
									<Separator className="my-2" />
								</div>
							))}
						</div>
					);
				},
			},
			{
				accessorKey: "assignment_stats.average_grade",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="p-0 h-auto font-medium"
					>
						Nilai Rata-rata
						<ArrowUpDown className="ml-2 w-4 h-4" />
					</Button>
				),
				cell: ({ row }) => {
					const stats = row.original.assignment_stats;
					return stats.average_grade !== null ? (
						<div
							className={`text-lg font-semibold ${getGradeColor(stats.average_grade)}`}
						>
							{stats.average_grade.toFixed(1)}
						</div>
					) : (
						<div className="text-muted-foreground">-</div>
					);
				},
				sortingFn: (rowA, rowB) => {
					const a = rowA.original.assignment_stats.average_grade || 0;
					const b = rowB.original.assignment_stats.average_grade || 0;
					return a - b;
				},
			},
			{
				accessorKey: "assignment_stats.graded_count",
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className="p-0 h-auto font-medium"
					>
						Status Penilaian
						<ArrowUpDown className="ml-2 w-4 h-4" />
					</Button>
				),
				cell: ({ row }) => {
					const stats = row.original.assignment_stats;
					const gradingRate =
						stats.submitted_count > 0
							? (stats.graded_count / stats.submitted_count) * 100
							: 0;
					return (
						<div className="space-y-2">
							<Badge
								variant="outline"
								className={getGradingStatusColor(
									stats.graded_count,
									stats.submitted_count,
								)}
							>
								{gradingRate.toFixed(0)}% ({stats.graded_count}/
								{stats.submitted_count})
							</Badge>
							<Progress value={gradingRate} className="w-20 h-2" />
						</div>
					);
				},
			},
		],
		[getGradeColor, getGradingStatusColor],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			columnFilters,
			globalFilter,
		},
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<div className="relative flex-1 max-w-sm">
					<Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2" />
					<Input
						placeholder="Cari siswa..."
						value={globalFilter ?? ""}
						onChange={(e) => setGlobalFilter(e.target.value)}
						className="pl-9"
					/>
				</div>
			</div>
			<div className="border rounded-md">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Tidak ada data siswa.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
