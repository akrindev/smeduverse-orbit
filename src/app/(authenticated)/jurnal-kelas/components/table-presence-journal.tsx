"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import type { IAttendance } from "@/types/attendance";

interface TablePresenceJournalProps {
	data: IAttendance[];
}

export default function TablePresenceJournal({
	data,
}: TablePresenceJournalProps) {
	const [view, setView] = useState<"table" | "grid">("table");

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div>
					<CardTitle>Jurnal Kelas</CardTitle>
					<CardDescription>
						Daftar jurnal kelas yang telah dibuat
					</CardDescription>
				</div>
				<ViewSwitcher onViewChange={setView} />
			</CardHeader>
			<CardContent>
				{data.length > 0 ? (
					view === "table" ? (
						<PresenceJournalTable data={data} />
					) : (
						<PresenceJournalGrid data={data} />
					)
				) : (
					<div className="my-12 flex justify-center items-center h-full">
						<div className="flex flex-col items-center">
							<div className="text-2xl font-semibold">Belum ada data</div>
							<div className="text-md font-normal">
								Tidak ada data untuk ditampilkan
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function PresenceJournalTable({ data }: { data: IAttendance[] }) {
	const router = useRouter();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Modul</TableHead>
					<TableHead>Judul</TableHead>
					<TableHead>Tanggal</TableHead>
					<TableHead>Kehadiran</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((presence) => {
					return (
						<TableRow
							key={presence.uuid}
							onClick={() => router.push(`/rekap/presensi/${presence.uuid}`)}
							className="cursor-pointer"
						>
							<TableCell>
								<div className="flex flex-col">
									<div className="font-medium">
										{presence.modul?.mapel.nama}
									</div>
									<span className="text-muted-foreground">
										{presence.modul?.teacher.fullname}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<div className="font-medium">{presence.title}</div>
									<span className="text-muted-foreground">
										{presence.modul?.rombel?.nama}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<span className="font-medium ">{presence.title}</span>
									<div className="font-normal text-muted-foreground">
										{format(new Date(presence.date), "dd MMMM yyyy", {
											locale: id,
										})}
									</div>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-wrap gap-2">
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700"
									>
										H: {presence.count_h || 0}
									</Badge>
									<Badge
										variant="outline"
										className="bg-yellow-50 text-yellow-700"
									>
										S: {presence.count_s || 0}
									</Badge>
									<Badge variant="outline" className="bg-blue-50 text-blue-700">
										I: {presence.count_i || 0}
									</Badge>
									<Badge variant="outline" className="bg-red-50 text-red-700">
										A: {presence.count_a || 0}
									</Badge>
									<Badge variant="outline" className="bg-red-50 text-red-700">
										B: {presence.count_b || 0}
									</Badge>
								</div>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

function PresenceJournalGrid({ data }: { data: IAttendance[] }) {
	const router = useRouter();

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((presence) => {
				return (
					<Card
						key={presence.uuid}
						onClick={() => router.push(`/rekap/presensi/${presence.uuid}`)}
						className="cursor-pointer"
					>
						<CardHeader>
							<CardTitle>{presence.title}</CardTitle>
							<CardDescription>{presence.modul?.mapel.nama}</CardDescription>
						</CardHeader>
						<CardContent>
							<p>{presence.modul?.teacher.fullname}</p>
							<p>{presence.modul?.rombel?.nama}</p>
							<p>
								{format(new Date(presence.date), "dd MMMM yyyy", {
									locale: id,
								})}
							</p>
							<div className="flex flex-wrap gap-2 mt-2">
								<Badge variant="outline" className="bg-green-50 text-green-700">
									H: {presence.count_h || 0}
								</Badge>
								<Badge
									variant="outline"
									className="bg-yellow-50 text-yellow-700"
								>
									S: {presence.count_s || 0}
								</Badge>
								<Badge variant="outline" className="bg-blue-50 text-blue-700">
									I: {presence.count_i || 0}
								</Badge>
								<Badge variant="outline" className="bg-red-50 text-red-700">
									A: {presence.count_a || 0}
								</Badge>
								<Badge variant="outline" className="bg-red-50 text-red-700">
									B: {presence.count_b || 0}
								</Badge>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
