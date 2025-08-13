"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import ViewSwitcher from "@/components/ui/view-switcher";
import { usePresence } from "@/store/usePresence";
import type { Presence } from "@/types/presence";

const colors = {
	H: "bg-green-500",
	S: "bg-yellow-500",
	I: "bg-blue-500",
	A: "bg-red-500",
	B: "bg-red-500",
};

export default function TableListPresensi({
	modulUuid,
}: {
	modulUuid: string;
}) {
	const [presences, fetchPresences] = usePresence<
		[Presence[], (modulUuid: string) => void]
	>((state) => [state.presences, state.fetchPresences]);
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
					<div className="flex flex-col justify-center items-center space-y-2 py-8">
						<p>Belum ada data presensi untuk ditampilkan</p>
					</div>
				) : view === "table" ? (
					<PresensiTable presences={presences} modulUuid={modulUuid} />
				) : (
					<PresensiGrid presences={presences} modulUuid={modulUuid} />
				)}
			</CardContent>
		</Card>
	);
}

function PresensiTable({
	presences,
	modulUuid,
}: {
	presences: Presence[];
	modulUuid: string;
}) {
	const router = useRouter();

	const handleViewPresence = (presence: Presence) => {
		router.push(`/modul/${modulUuid}/presensi/${presence.uuid}`);
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
				{presences.map((presence: Presence, i: number) => (
					<TableRow
						key={presence.uuid}
						onClick={() => handleViewPresence(presence)}
						className="cursor-pointer"
					>
						<TableCell>{presences.length - i}</TableCell>
						<TableCell className="p-2 max-w-[420px] text-left truncate whitespace-pre-line">
							<TooltipText text={presence.title} />
							{presence.description && (
								<div className="mt-1 line-clamp-2 text-muted-foreground text-xs">
									{presence.description}
								</div>
							)}
						</TableCell>
						<TableCell className="p-2 text-left">
							<div className="flex flex-wrap gap-1 text-left">
								{["h", "i", "s", "b", "a"].map(
									(status) =>
										presence[`count_${status}`] > 0 && (
											<Badge
												className={
													"text-white " +
													colors[status.slice(0, 5).toUpperCase()]
												}
												variant={"outline"}
												key={presence.uuid + status}
											>
												{status.toUpperCase()}: {presence[`count_${status}`]}
											</Badge>
										),
								)}
							</div>
							<div className="flex items-center gap-3 text-muted-foreground">
								<span className="inline-flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									{format(new Date(presence.date), "EEEE, PPP", { locale: id })}
								</span>
								<span className="inline-flex items-center gap-1">
									<Clock className="w-4 h-4" />
									{presence.start_time && presence.end_time
										? `${presence.start_time}–${presence.end_time}`
										: format(new Date(presence.date), "HH:mm", { locale: id })}
								</span>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function PresensiGrid({
	presences,
	modulUuid,
}: {
	presences: Presence[];
	modulUuid: string;
}) {
	const router = useRouter();

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{presences.map((presence) => (
				<Card
					key={presence.uuid}
					onClick={() =>
						router.push(`/modul/${modulUuid}/presensi/${presence.uuid}`)
					}
					className="cursor-pointer"
				>
					<CardHeader>
						<CardTitle>{presence.title}</CardTitle>
						<CardDescription>{presence.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-1 text-left">
							{["h", "i", "s", "b", "a"].map(
								(status) =>
									presence[`count_${status}`] > 0 && (
										<Badge
											className={
												"text-white " + colors[status.slice(0, 5).toUpperCase()]
											}
											variant={"outline"}
											key={presence.uuid + status}
										>
											{status.toUpperCase()}: {presence[`count_${status}`]}
										</Badge>
									),
							)}
						</div>
						<div className="text-muted-foreground">
							{format(new Date(presence.date), "EEEE, PPP", {
								locale: id,
							})}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}

function TooltipText({ text }: { text: string }) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<span>{text}</span>
				</TooltipTrigger>
				<TooltipContent>
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
