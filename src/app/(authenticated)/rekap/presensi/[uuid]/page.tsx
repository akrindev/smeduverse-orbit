"use client";

import { IconDownload } from "@tabler/icons-react";
import type { AxiosPromise, AxiosResponse } from "axios";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";
// import KelasAjarAttendanceAnalytics from "./components/kelas-ajar-attendance-analytics";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import BaseLoading from "@/components/base-loading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { useKelasAjar } from "@/store/useKelasAjar";
import type { KelasAjar } from "@/types/modul";
import TableAttendances from "./components/table-attendances";
import TablePresences from "./components/table-presence";

export default function RekapPage() {
	const { uuid } = useParams<{ uuid: string }>();
	const [loading, setLoading] = useState(false);
	const [kelasAjar, fetchKelasAjar] = useKelasAjar<
		[
			kelasAjar: KelasAjar | null,
			fetchByUuid: (uuid: string) => AxiosPromise<AxiosResponse>,
		]
	>((state) => [state.kelasAjar, state.fetchByUuid]);

	const router = useRouter();

	// Use the custom auth store instead of next-auth
	const { user, isLoading } = useAuth();

	useEffect(() => {
		fetchKelasAjar(uuid).catch(() => {
			router.push("/kelas-ajar");
		});
	}, [uuid, fetchKelasAjar, router]);

	if (!user || isLoading || !kelasAjar) {
		return <BaseLoading />;
	}

	// handle cetak
	const handleExport = async () => {
		setLoading(true);
		// download data using axios api
		await api
			.get(`/modul/presence/recap/export/${uuid}`, {
				responseType: "blob",
			})
			.then((response) => {
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute(
					"download",
					`rekap presensi ${kelasAjar?.mapel.kode}-${kelasAjar?.rombel.nama}.xlsx`,
				);
				document.body.appendChild(link);
				link.click();
			})
			.finally(() => setLoading(false));
	};

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				<div className="flex md:flex-row flex-col justify-between">
					<div className="space-y-1 mt-5">
						<h2 className="font-semibold text-2xl tracking-tight">
							Rekap Presensi
						</h2>
						<p className="text-muted-foreground text-sm">
							Rekap presensi pada kelas ajar {kelasAjar?.mapel.nama} <br />
							{kelasAjar?.rombel.nama} - {kelasAjar?.teacher.fullname}
						</p>
					</div>
					<div className="flex gap-3 mt-5 md:mt-0">
						<Button variant="outline" onClick={handleExport} disabled={loading}>
							{loading ? (
								<Loader className="w-5 h-5" />
							) : (
								<div className="flex items-center gap-2">
									Unduh
									<IconDownload className="w-4 h-4" />
								</div>
							)}
						</Button>
						<div className="flex mb-2">
							<Link href={`/kelas-ajar/${uuid}`}>
								<Button
									variant="outline"
									className="flex items-center gap-2 w-fit"
								>
									<ArrowLeft className="w-4 h-4" />
									Kembali
								</Button>
							</Link>
						</div>
						{/* {isUser(user, kelasAjar?.teacher_id!) && (
              <Link href={`/kelas-ajar/${params.uuid}`}>
                <Button variant='default'>
                  Lihat
                  <IconLink className='ml-1 w-4 h-4' />
                </Button>
              </Link>
            )} */}
					</div>
				</div>
				<Separator className="my-4" />

				{/* table */}
				<Tabs defaultValue="rekap">
					<TabsList className="grid grid-cols-2 max-w-md">
						<TabsTrigger value="rekap">Kehadiran</TabsTrigger>
						<TabsTrigger value="presensi">Presensi</TabsTrigger>
					</TabsList>
					<TabsContent value="rekap">
						<TableAttendances modulUuid={uuid} />
					</TabsContent>
					<TabsContent value="presensi">
						<TablePresences modulUuid={uuid} />
					</TabsContent>
				</Tabs>
				{/* end: table */}
			</div>
		</div>
	);
}
