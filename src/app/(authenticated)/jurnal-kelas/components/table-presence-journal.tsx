"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ExternalLink } from "lucide-react";
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
			<CardHeader className="flex flex-row justify-between items-center">
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

function PresenceJournalTable({ data }: { data: IAttendance[] }) {
	const router = useRouter();

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Judul</TableHead>
					<TableHead>Modul</TableHead>
					<TableHead>Tanggal</TableHead>
					<TableHead>Kehadiran</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((presence) => {
					return (
						<TableRow
							key={presence.uuid}
							onClick={() =>
								router.push(`/rekap/presensi/${presence.orbit_modul_uuid}`)
							}
							className="cursor-pointer"
						>
							<TableCell>
								<div className="flex flex-col hover:underline">
									<div className="flex items-center gap-1 font-medium">
										{presence.title}
										<ExternalLink className="w-3 h-3 text-blue-500" />
									</div>
									<span className="text-muted-foreground">
										{presence.modul?.rombel?.nama}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<div className="font-medium">
										{presence.modul?.mapel.kode}
									</div>
									<span className="text-muted-foreground">
										{presence.modul?.teacher.fullname}
									</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex flex-col">
									<div className="font-normal">
										{format(new Date(presence.date), "dd MMMM yyyy", {
											locale: id,
										})}
									</div>
									{presence.start_time && presence.end_time && (
										<div className="text-muted-foreground text-xs">
											{format(
												new Date(`1970-01-01T${presence.start_time}`),
												"HH:mm",
											)}{" "}
											-{" "}
											{format(
												new Date(`1970-01-01T${presence.end_time}`),
												"HH:mm",
											)}
										</div>
									)}
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
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
