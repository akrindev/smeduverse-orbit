"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type {
	Journal,
	Student,
	StudentJournalResponse,
} from "../../../../store/useStudentJournal.ts";

interface StudentJournalTableProps {
	data: StudentJournalResponse;
}

interface JournalWithStudent extends Journal {
	student: Student;
}

export default function StudentJournalTable({
	data,
}: StudentJournalTableProps) {
	const [view, setView] = useState<"table" | "grid">("table");

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>Jurnal Siswa - {data.rombel.nama}</CardTitle>
					<CardDescription>
						Daftar jurnal siswa yang telah dibuat
					</CardDescription>
				</div>
				<ViewSwitcher onViewChange={setView} />
			</CardHeader>
			<CardContent>
				{data.students.data.length === 0 ? (
					<div className="p-8 border rounded-md">
						<div className="flex flex-col justify-center items-center text-center">
							<h3 className="font-medium text-lg">Belum ada data</h3>
							<p className="mt-1 text-muted-foreground text-sm">
								Tidak ada jurnal siswa yang tersedia dengan filter yang dipilih
							</p>
						</div>
					</div>
				) : view === "table" ? (
					<GroupedJournalTable students={data.students.data} />
				) : (
					<GroupedJournalGrid students={data.students.data} />
				)}
			</CardContent>
		</Card>
	);
}

function GroupedJournalTable({ students }: { students: Student[] }) {
	const sortedStudents = students.map((student) => ({
		...student,
		journals: [...student.journals].sort((a, b) =>
			a.modul.mapel.nama.localeCompare(b.modul.mapel.nama),
		),
	}));

	return (
		<Accordion type="multiple" className="space-y-4">
			{sortedStudents.map((student) => (
				<AccordionItem
					key={student.student_id}
					value={student.student_id}
					className="px-4 border rounded-lg"
				>
					<AccordionTrigger className="py-4">
						<div className="flex items-center gap-4">
							<div>
								<h3 className="font-semibold text-lg text-left">
									{student.fullname}
								</h3>
								<p className="text-muted-foreground text-sm">{student.nisn}</p>
							</div>
							<div className="text-muted-foreground text-sm">
								{student.journals.length} jurnal
							</div>
						</div>
					</AccordionTrigger>
					<AccordionContent className="pb-4">
						{student.journals.length === 0 ? (
							<p className="text-muted-foreground">Tidak ada jurnal</p>
						) : (
							<StudentJournalSubTable
								journals={student.journals.map((journal) => ({
									...journal,
									student,
								}))}
							/>
						)}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}

function StudentJournalSubTable({
	journals,
}: {
	journals: JournalWithStudent[];
}) {
	const columns: ColumnDef<JournalWithStudent>[] = useMemo(
		() => [
			{
				header: "Judul",
				accessorKey: "title",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<Link
							href={`/modul/${row.original.modul.uuid}/presensi/${row.original.presence_uuid}`}
							className="hover:underline"
						>
							<div className="flex items-center gap-1 font-medium">
								{row.original.title}
								<ExternalLink className="w-3 h-3 text-blue-500" />
							</div>
						</Link>
						<span className="text-muted-foreground text-sm line-clamp-1">
							{row.original.description}
						</span>
						{/* Mobile: Show additional info inline */}
						<div className="md:hidden space-y-0.5 mt-2">
							<div className="text-muted-foreground text-xs">
								{row.original.modul.mapel.kode} -{" "}
								{row.original.modul.mapel.nama}
							</div>
							<div className="text-muted-foreground text-xs">
								{row.original.modul.teacher.fullname}
							</div>
							<div className="flex items-center gap-1 text-muted-foreground text-xs">
								<CalendarIcon className="w-3 h-3" />
								<span>
									{format(new Date(row.original.date), "E, dd MMM yy", {
										locale: id,
									})}
								</span>
							</div>
							<div className="flex items-center gap-1 text-muted-foreground text-xs">
								<Clock className="w-3 h-3" />
								<span>
									{row.original.start_time} - {row.original.end_time}
								</span>
							</div>
						</div>
					</div>
				),
			},
			{
				header: "Modul",
				accessorKey: "modul",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<div className="font-medium">{row.original.modul.mapel.kode}</div>
						<span className="text-muted-foreground text-sm">
							{row.original.modul.teacher.fullname}
						</span>
					</div>
				),
			},
			{
				header: "Tanggal dan Waktu",
				accessorKey: "date",
				cell: ({ row }) => (
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<CalendarIcon className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm">
								{format(new Date(row.original.date), "E, dd MMMM yyyy", {
									locale: id,
								})}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm">
								{row.original.start_time} - {row.original.end_time}
							</span>
						</div>
					</div>
				),
			},
			{
				header: "Kehadiran",
				accessorKey: "attendance",
				cell: ({ row }) => {
					const status = row.original.attendance.status;
					let badgeClass = "";
					let statusText = "";
					switch (status) {
						case "present":
							badgeClass = "bg-green-50 hover:bg-green-50 text-green-700";
							statusText = "Hadir";
							break;
						case "sick":
							badgeClass = "bg-yellow-50 hover:bg-yellow-50 text-yellow-700";
							statusText = "Sakit";
							break;
						case "permission":
							badgeClass = "bg-blue-50 hover:bg-blue-50 text-blue-700";
							statusText = "Izin";
							break;
						case "absent":
							badgeClass = "bg-red-50 hover:bg-red-50 text-red-700";
							statusText = "Alpha";
							break;
						case "truant":
							badgeClass = "bg-red-50 hover:bg-red-50 text-red-700";
							statusText = "Bolos";
							break;
						default:
							badgeClass = "bg-gray-50 hover:bg-gray-50 text-gray-700";
							statusText = status;
					}
					return (
						<Badge variant="outline" className={badgeClass}>
							{statusText}
						</Badge>
					);
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: journals,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header) => {
							// Hide certain columns on mobile
							const isHiddenOnMobile =
								header.column.id === "modul" || header.column.id === "date";
							return (
								<TableHead
									key={header.id}
									className={isHiddenOnMobile ? "hidden md:table-cell" : ""}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
						{row.getVisibleCells().map((cell) => {
							// Hide certain columns on mobile
							const isHiddenOnMobile =
								cell.column.id === "modul" || cell.column.id === "date";
							return (
								<TableCell
									key={cell.id}
									className={isHiddenOnMobile ? "hidden md:table-cell" : ""}
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							);
						})}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function GroupedJournalGrid({ students }: { students: Student[] }) {
	return (
		<div className="space-y-6">
			{students.map((student) => (
				<div key={student.student_id} className="p-4 border rounded-lg">
					<div className="mb-4">
						<h3 className="font-semibold text-lg">{student.fullname}</h3>
						<p className="text-muted-foreground">{student.nisn}</p>
					</div>
					{student.journals.length === 0 ? (
						<p className="text-muted-foreground">Tidak ada jurnal</p>
					) : (
						<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
							{student.journals.map((journal) => {
								const status = journal.attendance.status;
								let badgeClass = "";
								let statusText = "";
								switch (status) {
									case "present":
										badgeClass = "bg-green-50 hover:bg-green-50 text-green-700";
										statusText = "Hadir";
										break;
									case "sick":
										badgeClass =
											"bg-yellow-50 hover:bg-yellow-50 text-yellow-700";
										statusText = "Sakit";
										break;
									case "permission":
										badgeClass = "bg-blue-50 hover:bg-blue-50 text-blue-700";
										statusText = "Izin";
										break;
									case "absent":
										badgeClass = "bg-red-50 hover:bg-red-50 text-red-700";
										statusText = "Alpha";
										break;
									case "truant":
										badgeClass = "bg-red-50 hover:bg-red-50 text-red-700";
										statusText = "Bolos";
										break;
									default:
										badgeClass = "bg-gray-50 hover:bg-gray-50 text-gray-700";
										statusText = status;
								}
								return (
									<Link
										href={`/modul/${journal.modul.uuid}/presensi/${journal.presence_uuid}`}
										key={journal.presence_uuid}
									>
										<Card className="cursor-pointer">
											<CardHeader>
												<CardTitle>{journal.title}</CardTitle>
												<CardDescription>
													{journal.modul.mapel.nama}
												</CardDescription>
											</CardHeader>
											<CardContent className="space-y-2">
												<p className="font-medium">{student.fullname}</p>
												<p>{journal.modul.teacher.fullname}</p>
												<div className="flex items-center gap-2">
													<CalendarIcon className="w-4 h-4 text-muted-foreground" />
													<span>
														{format(new Date(journal.date), "E, dd MMMM yyyy", {
															locale: id,
														})}
													</span>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="w-4 h-4 text-muted-foreground" />
													<span>
														{journal.start_time} - {journal.end_time}
													</span>
												</div>
												<Badge variant="outline" className={badgeClass}>
													{statusText}
												</Badge>
											</CardContent>
										</Card>
									</Link>
								);
							})}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
