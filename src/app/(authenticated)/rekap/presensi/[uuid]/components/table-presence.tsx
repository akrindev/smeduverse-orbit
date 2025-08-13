"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
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
import { usePresence } from "@/store/usePresence";
import type { Presence } from "@/types/presence";

export default function TablePresences({ modulUuid }: { modulUuid: string }) {
	const [presences, fetchPresences] = usePresence((state) => [
		state.presences,
		state.fetchPresences,
	]);
	const [view, setView] = useState<"table" | "grid">("table");

	useEffect(() => {
		fetchPresences(modulUuid);
	}, [modulUuid, fetchPresences]);

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>Daftar Presensi</CardTitle>
					<CardDescription>
						Daftar semua presensi yang terdaftar
					</CardDescription>
				</div>
				<ViewSwitcher onViewChange={setView} />
			</CardHeader>
			<CardContent>
				{presences.length === 0 ? (
					<div className="py-8 text-center">Tidak ada presensi</div>
				) : view === "table" ? (
					<PresenceTable presences={presences} />
				) : (
					<PresenceGrid presences={presences} />
				)}
			</CardContent>
		</Card>
	);
}

function PresenceTable({ presences }: { presences: Presence[] }) {
	const statusLabels = {
		h: "Hadir",
		i: "Izin",
		s: "Sakit",
		a: "Alpa",
		b: "Bolos",
	};
	const statusColors = {
		h: "bg-green-500 text-white",
		i: "bg-blue-500 text-white",
		s: "bg-yellow-500 text-black",
		a: "bg-red-500 text-white",
		b: "bg-rose-500 text-white",
	};
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-10 text-left">No</TableHead>
					<TableHead className="text-left">Judul & Deskripsi</TableHead>
					<TableHead className="text-left">Tanggal</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{presences.map((presence: Presence, i) => (
					<TableRow key={presence.uuid} className="cursor-pointer">
						<TableCell>{presences.length - i}</TableCell>
						<TableCell>
							<div className="font-medium">{presence.title}</div>
							{presence.description && (
								<div className="text-muted-foreground text-sm">
									{presence.description}
								</div>
							)}
						</TableCell>
						<TableCell>
							<div>
								<div className="flex flex-wrap gap-1">
									{(["h", "i", "s", "a", "b"] as const).map((status) => {
										const count = presence[
											`count_${status}` as keyof Presence
										] as number;
										return count > 0 ? (
											<Badge
												key={status}
												className={`${statusColors[status]} font-medium`}
											>
												{statusLabels[status]}: {count}
											</Badge>
										) : null;
									})}
								</div>
								<div className="flex items-center gap-3 text-muted-foreground">
									<span className="inline-flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{format(new Date(presence.date), "EEEE, PPP", {
											locale: id,
										})}
									</span>
									<span className="inline-flex items-center gap-1">
										<Clock className="w-4 h-4" />
										{presence.start_time && presence.end_time
											? `${presence.start_time}–${presence.end_time}`
											: format(new Date(presence.date), "HH:mm", {
													locale: id,
												})}
									</span>
								</div>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function PresenceGrid({ presences }: { presences: Presence[] }) {
	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{presences.map((presence) => (
				<Card key={presence.uuid} className="cursor-pointer">
					<CardHeader>
						<CardTitle>{presence.title}</CardTitle>
						<CardDescription>{presence.description}</CardDescription>
					</CardHeader>
					<CardContent>
						{format(new Date(presence.date), "EEEE, PPP", {
							locale: id,
						})}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
