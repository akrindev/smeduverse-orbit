// this is the component that is used to display the kelas ajar card

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { KelasAjar } from "@/types/modul";
import ContextMenuKelasAjar from "../kelas-ajar/components/context-menu-kelas-ajar";

export default function KelasAjarCard({
	kelasAjar,
	className,
	isUser,
	isWakaKurikulum,
}: {
	kelasAjar: KelasAjar;
	className?: string;
	isUser?: boolean;
	isWakaKurikulum?: boolean;
}) {
	const theCard = (
		<Card
			className={cn("hover:shadow-xl hover:scale-95 duration-300", className)}
		>
			<CardHeader>
				<CardTitle>{kelasAjar.rombel.nama}</CardTitle>
				<CardDescription className="text-xs">
					{kelasAjar.semester?.name} | {kelasAjar.teacher.fullname}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 text-sm">
					<div className="space-x-3">
						<Badge>{kelasAjar.mapel.kode}</Badge>
						<span>{kelasAjar.mapel.nama}</span>
					</div>

					{kelasAjar.latest_presence ? (
						<>
							<Separator />
							<div className="text-xs">
								<div className="font-medium">
									<span className="text-muted-foreground">Jurnal Terbaru:</span>
									<div>{kelasAjar.latest_presence.title}</div>
								</div>
								<div className="text-muted-foreground">
									{kelasAjar.latest_presence.description}
								</div>
								<div className="text-muted-foreground">
									{(() => {
										try {
											// Try to parse the date safely
											const dateValue = kelasAjar.latest_presence.date;
											if (dateValue) {
												// Handle both ISO string and date-only formats
												const parsedDate = dateValue.includes("T")
													? new Date(dateValue)
													: new Date(`${dateValue}T00:00:00`);

												if (!Number.isNaN(parsedDate.getTime())) {
													return format(parsedDate, "EEEE, PPP", {
														locale: localeId,
													});
												}
											}
											// Fallback to showing the raw date string
											return kelasAjar.latest_presence.date;
										} catch {
											// Fallback to showing the raw date string if parsing fails
											return kelasAjar.latest_presence.date;
										}
									})()} • {kelasAjar.latest_presence.start_time} -{" "}
									{kelasAjar.latest_presence.end_time}
								</div>
								<div className="flex flex-wrap gap-1 pt-1">
									{(["h", "i", "s", "a", "b"] as const).map((k) => {
										const key = `count_${k}` as const;
										const count = kelasAjar.latest_presence?.[key] ?? 0;
										if (!count) return null;

										// Define colors for each status
										const statusColors = {
											h: "bg-green-600 text-green-200 border-green-700", // Hadir - Green
											i: "bg-blue-600 text-blue-200 border-blue-700", // Izin - Blue
											s: "bg-yellow-600 text-yellow-200 border-yellow-700", // Sakit - Yellow
											a: "bg-red-600 text-red-200 border-red-700", // Alpa - Red
											b: "bg-rose-600 text-rose-200 border-rose-700", // Bolos - Rose
										};

										return (
											<Badge
												key={k}
												variant="outline"
												className={statusColors[k]}
											>
												{k.toUpperCase()}: {count}
											</Badge>
										);
									})}
								</div>
							</div>
						</>
					) : (
						<>
							<Separator />
							<div className="text-muted-foreground text-xs">
								Belum ada presensi terbaru
							</div>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);

	return (
		<Link
			href={isUser ? `/kelas-ajar/${kelasAjar.uuid}` : `/rekap/presensi/${kelasAjar.uuid}`}
			className="space-y-1 col-span-12 md:col-span-6 xl:col-span-4"
		>
			{isUser ? (
				<ContextMenuKelasAjar kelasAjar={kelasAjar}>{theCard}</ContextMenuKelasAjar>
			) : (
				theCard
			)}
		</Link>
	);
}
