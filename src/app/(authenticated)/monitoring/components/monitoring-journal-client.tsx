"use client";

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
import { useMonitorJournalQuery } from "@/queries/useMonitorJournalQuery";
import type { Journal } from "@/types/monitor";

export default function MonitoringJournalClient() {
	const [view, setView] = useState<"table" | "grid">("table");
	const { todayJournalQuery } = useMonitorJournalQuery(10000);
	const { data, isLoading, error } = todayJournalQuery;

	if (isLoading) {
		return <div className="py-8 text-center">Memuat data jurnal...</div>;
	}

	if (error) {
		return (
			<div className="py-8 text-center text-red-500">
				Gagal memuat data jurnal
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row justify-between items-center">
					<div>
						<CardTitle>Jurnal Guru Hari Ini</CardTitle>
						<CardDescription>
							Daftar jurnal guru yang dibuat hari ini
						</CardDescription>
					</div>
					<ViewSwitcher onViewChange={setView} />
				</CardHeader>
				<CardContent>
					{view === "table" ? (
						<JournalTable data={data?.data ?? []} />
					) : (
						<JournalGrid data={data?.data ?? []} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function JournalTable({ data }: { data: Journal[] }) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Guru</TableHead>
					<TableHead>Mata Pelajaran</TableHead>
					<TableHead>Rombel</TableHead>
					<TableHead>Waktu</TableHead>
					<TableHead>Kehadiran</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((journal) => (
					<JournalRow key={journal.uuid} journal={journal} />
				))}
			</TableBody>
		</Table>
	);
}

function JournalRow({ journal }: { journal: Journal }) {
	const router = useRouter();

	const handleNavigate = () => {
		router.push(`/rekap/presensi/${journal.orbit_modul_uuid}`);
	};

	return (
		<TableRow>
			<TableCell>
				<div className="font-medium">{journal.modul.teacher.fullname}</div>
				<div className="text-muted-foreground text-sm">
					{journal.modul.teacher.niy}
				</div>
			</TableCell>
			<TableCell
				className="hover:underline cursor-pointer"
				onClick={handleNavigate}
			>
				{journal.modul.mapel.nama}
				<ExternalLink className="inline-block ml-2 w-3 h-3 text-blue-700" />
			</TableCell>
			<TableCell>{journal.modul.rombel.nama}</TableCell>
			<TableCell>
				{journal.start_time} - {journal.end_time}
			</TableCell>
			<TableCell>
				<div className="flex gap-1">
					<Badge variant="outline" className="bg-green-50 text-green-700">
						H: {journal.count_h}
					</Badge>
					<Badge variant="outline" className="bg-yellow-50 text-yellow-700">
						S: {journal.count_s}
					</Badge>
					<Badge variant="outline" className="bg-blue-50 text-blue-700">
						I: {journal.count_i}
					</Badge>
					<Badge variant="outline" className="bg-red-50 text-red-700">
						A: {journal.count_a}
					</Badge>
					<Badge variant="outline" className="bg-red-50 text-red-700">
						B: {journal.count_b}
					</Badge>
				</div>
			</TableCell>
		</TableRow>
	);
}

function JournalGrid({ data }: { data: Journal[] }) {
	const router = useRouter();

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{data.map((journal) => (
				<Card
					key={journal.uuid}
					className="cursor-pointer"
					onClick={() => router.push(`/rekap/presensi/${journal.uuid}`)}
				>
					<CardHeader>
						<CardTitle>{journal.modul.mapel.nama}</CardTitle>
						<CardDescription>{journal.modul.rombel.nama}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<div>
							<p className="font-medium">{journal.modul.teacher.fullname}</p>
							<p className="text-muted-foreground text-sm">
								{journal.modul.teacher.niy}
							</p>
						</div>
						<p>
							{journal.start_time} - {journal.end_time}
						</p>
						<div className="flex flex-wrap gap-1">
							<Badge variant="outline">H: {journal.count_h}</Badge>
							<Badge variant="outline">S: {journal.count_s}</Badge>
							<Badge variant="outline">I: {journal.count_i}</Badge>
							<Badge variant="outline">A: {journal.count_a}</Badge>
							<Badge variant="outline">B: {journal.count_b}</Badge>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
