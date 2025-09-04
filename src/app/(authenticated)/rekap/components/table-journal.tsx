"use client";

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
import type { IAttendance } from "@/types/attendance";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface TableJournalProps {
	data: IAttendance[];
}

export default function TableJournal({ data }: TableJournalProps) {
	const [view, setView] = useState<"table" | "grid">("table");

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>Jurnal Guru</CardTitle>
					<CardDescription>
						Daftar jurnal guru yang telah dibuat
					</CardDescription>
				</div>
				<ViewSwitcher onViewChange={setView} />
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					view === "table" ? (
						<JournalTable data={data} />
					) : (
						<JournalGrid data={data} />
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

function JournalTable({ data }: { data: IAttendance[] }) {
	const router = useRouter();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Modul</TableHead>
					<TableHead>Judul</TableHead>
					<TableHead>Deskripsi</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((journal) => (
					<TableRow
						key={journal.uuid}
						onClick={() => router.push(`/rekap/presensi/${journal.uuid}`)}
						className="cursor-pointer"
					>
						<TableCell>
							<div className="flex flex-col">
								<div className="font-medium">{journal.modul?.mapel.nama}</div>
								<span className="text-muted-foreground">
									{journal.modul?.teacher.fullname}
								</span>
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-col">
								<div className="font-medium">{journal.title}</div>
								<span className="text-muted-foreground">
									{format(new Date(journal.date), "dd MMMM yyyy", {
										locale: id,
									})}
								</span>
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-col">
								<div className="text-muted-foreground">
									{journal.modul?.rombel?.nama}
								</div>
								<span>{journal.description}</span>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function JournalGrid({ data }: { data: IAttendance[] }) {
	const router = useRouter();

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{data.map((journal) => (
				<Card
					key={journal.uuid}
					onClick={() => router.push(`/rekap/presensi/${journal.uuid}`)}
					className="cursor-pointer"
				>
					<CardHeader>
						<CardTitle>{journal.title}</CardTitle>
						<CardDescription>{journal.modul?.mapel.nama}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>{journal.modul?.teacher.fullname}</p>
						<p>{journal.modul?.rombel?.nama}</p>
						<p>
							{format(new Date(journal.date), "dd MMMM yyyy", {
								locale: id,
							})}
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
