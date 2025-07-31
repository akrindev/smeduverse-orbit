"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import BaseLoading from "@/components/base-loading";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ViewSwitcher from "@/components/ui/view-switcher";
import { cn } from "@/lib/utils";
import { useAttendance } from "@/store/useAttendance";
import type { Attendance, OrbitPresence } from "@/types/attendance";
import SheetDetailAttendance from "./sheet-detail-attendance";

interface TableAttendancesProps {
	modulUuid: string;
}

export default function TableAttendances({ modulUuid }: TableAttendancesProps) {
	const [data, setData] = useState<Attendance[]>([]);
	//   counted by first student orbit_presence
	const [orbitPresence, setOrbitPresence] = useState<OrbitPresence[]>([]);
	const [view, setView] = useState<"table" | "grid">("table");

	const getRecapAttendances = useAttendance(
		(state) => state.getRecapAttendances,
	);

	const columns: ColumnDef<Attendance>[] = useMemo(
		() => [
			{
				header: "No",
				cell: (cell) => cell.row.index + 1,
				maxSize: 50,
			},
			{
				header: "Nama",
				accessorKey: "fullname",
				cell: (cell) => (
					<SheetDetailAttendance attendance={cell.row.original} />
				),
			},
			...orbitPresence.map((presence, i) => ({
				header: () => i + 1,
				accessorKey: presence.uuid,

				//   the cell is the presence status coming from orbit_presence
				cell: (cell) => {
					const status =
						cell.row.original.orbit_presence[
							i
						]?.presence.status.toUpperCase() || "";

					// colors the status
					const colors = [
						{ status: "H", color: "text-green-500" },
						{ status: "S", color: "text-yellow-500" },
						{ status: "I", color: "text-blue-500" },
						{ status: "A", color: "text-red-500" },
						{ status: "B", color: "text-red-500" },
					];

					const matchedColor = colors.find(
						(color) => color.status === status,
					)?.color;

					return <div className={`${matchedColor} font-medium`}>{status}</div>;
				},
			})),
			{
				header: "Rekap",
				accessorKey: "status_count",
				cell: (cell) => {
					return (
						<div className="flex gap-3">
							{Object.entries(cell.row.original?.status_count || {}).map(
								([key, value]) => {
									const colors = {
										H: "bg-green-500",
										S: "bg-yellow-500",
										I: "bg-blue-500",
										A: "bg-red-500",
										B: "bg-red-500",
									};

									const matchedColor = colors[key.toUpperCase()];

									return (
										<Badge
											variant={"outline"}
											className={matchedColor}
											key={key}
										>
											{key.toUpperCase()}: {value}
										</Badge>
									);
								},
							)}
						</div>
					);
				},
			},
		],
		[orbitPresence],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	useEffect(() => {
		getRecapAttendances(modulUuid)
			.then((res) => {
				if (res.status === 200) {
					// @ts-ignore
					setData(res.data);

					//   set countedPresence by the first student orbit_presence
					setOrbitPresence(res.data[0].orbit_presence);
				}
			})
			.catch((error) => {
				// console.log(error);
			});
	}, [modulUuid, getRecapAttendances]);

	if (!data.length) return <BaseLoading />;

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>Daftar Kehadiran</CardTitle>
					<CardDescription>
						Daftar kehadiran siswa berdasarkan modul
					</CardDescription>
				</div>
				<ViewSwitcher onViewChange={setView} />
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					view === "table" ? (
						<AttendanceDetailTable data={data} columns={columns} />
					) : (
						<AttendanceDetailGrid data={data} columns={columns} />
					)
				) : (
					<div className="flex justify-center items-center my-12 h-full">
						<div className="flex flex-col items-center">
							<div className="font-semibold text-2xl">Belum ada data</div>
							<div className="font-normal text-md">
								Tidak ada data untuk ditampilkan
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface AttendanceDetailTableProps {
	data: Attendance[];
	columns: ColumnDef<Attendance>[];
}

function AttendanceDetailTable({ data, columns }: AttendanceDetailTableProps) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div className="border rounded-md">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									className="p-2"
									key={header.id}
									style={{
										width:
											header.getSize() !== 150 ? header.getSize() : undefined,
									}}
								>
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
					{table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className={cn({
										"p-2 whitespace-nowrap": true,
									})}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
			{/* <ScrollBar orientation='horizontal' /> */}
		</div>
	);
}

function AttendanceDetailGrid({ data, columns }: AttendanceDetailTableProps) {
	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{data.map((attendance: Attendance) => (
				<Card key={attendance.student_id} className="cursor-pointer">
					<CardHeader>
						<CardTitle>{attendance.fullname}</CardTitle>
						<CardDescription>{attendance.nipd}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col">
							{Object.entries(attendance.status_count!).map(([key, value]) => (
								<Badge variant={"outline"} key={key}>
									{key.toUpperCase()}: {value}
								</Badge>
							))}
						</div>
						<div className="mt-2 text-muted-foreground text-sm">
							{attendance.orbit_presence &&
								attendance.orbit_presence.length > 0 && (
									<p>
										Terakhir presensi:
										{format(
											new Date(
												attendance.orbit_presence?.[0].presence.created_at,
											),
											"dd MMMM yyyy",
											{
												locale: id,
											},
										)}
									</p>
								)}
						</div>
						<SheetDetailAttendance attendance={attendance} />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
