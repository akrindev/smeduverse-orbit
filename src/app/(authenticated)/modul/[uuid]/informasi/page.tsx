"use client";

import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useModulQuery } from "@/queries/useModulQuery";

export default function PreseniPage() {
	const { uuid } = useParams<{ uuid: string }>();
	const { modulInfoQuery } = useModulQuery(uuid);
	const modul = modulInfoQuery.data as any;

	return (
		<div className="space-y-6">
			<div className="gap-3 grid grid-cols-12">
				<div className="col-span-12 md:col-span-6">
					<h3 className="font-medium text-lg">Informasi</h3>
					<p className="text-muted-foreground text-sm">Informasi modul</p>
				</div>
			</div>
			<Separator />
			{modul && (
				<div className="gap-3 md:gap-6 grid grid-cols-12">
					<div className="col-span-12">
						<h3 className="font-medium text-md">Judul Modul</h3>
						<p className="text-muted-foreground text-sm">{modul.mapel.nama}</p>
					</div>

					<div className="col-span-12">
						<h3 className="font-medium text-md">Guru Pengajar</h3>
						<p className="text-muted-foreground text-sm">
							{modul.teacher.fullname}
						</p>
					</div>

					<div className="col-span-12">
						<h3 className="font-medium text-md">Kelas</h3>
						<p className="text-muted-foreground text-sm">{modul.rombel.nama}</p>
					</div>

					<div className="col-span-12">
						<h3 className="font-medium text-md">Semester</h3>
						<p className="text-muted-foreground text-sm">
							{modul.semester?.name}
						</p>
					</div>

					<div className="col-span-12">
						<h3 className="font-medium text-md">Status</h3>
						<p className="text-muted-foreground text-sm">
							{modul.status ? "Aktif" : "Tidak Aktif"}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
