"use client";

import type { AxiosPromise, AxiosResponse } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useModulQuery } from "@/queries/useModulQuery";
import { useAuth } from "@/store/useAuth";
import { usePresence } from "@/store/usePresence";
import type { Presence } from "@/types/presence";
import Information from "./components/information";
import TablePresensi from "./components/table-presensi";

export default function PreseniPage() {
	const { uuid, presensiUuid } = useParams<{
		uuid: string;
		presensiUuid: string;
	}>();
	const [loading, setLoading] = useState(false);
	const [presence, showPresence] = usePresence<
		[Presence, (uuid: string) => AxiosPromise<AxiosResponse>]
	>((state) => [state.presence, state.showPresence]);

	const updatingPresence = useCallback(() => {
		setLoading(true);
		return showPresence(presensiUuid).finally(() => setLoading(false));
	}, [presensiUuid, showPresence]);

	const router = useRouter();
	const { user } = useAuth();
	const { modulInfoQuery } = useModulQuery(uuid);

	useEffect(() => {
		updatingPresence().catch((res) => {
			if (res.response.status === 404) {
				toast({
					title: "Presensi tidak ditemukan",
					description: "Presensi yang anda cari tidak ditemukan",
				});

				router.push(`/modul/${uuid}`);
			}
		});
	}, [router, updatingPresence, uuid]);

	// Redirect if current user is not the owner (teacher) of the module
	useEffect(() => {
		if (
			modulInfoQuery?.data &&
			user &&
			modulInfoQuery.data.teacher.teacher_id !== user.id
		) {
			router.push(`/rekap/presensi/${uuid}`);
		}
	}, [modulInfoQuery?.data, user, uuid, router]);

	return (
		<div>
			<Information
				key={presence.updated_at}
				modulUuid={uuid}
				presenceUuid={presensiUuid}
				title={presence?.title}
				description={presence?.description}
				date={presence?.date}
				presence={presence}
				onRefreshAction={updatingPresence}
				isLoading={loading}
			/>
			{/* <Separator className="my-4" /> */}
			<div className="relative mt-5 border rounded-md w-full">
				<ScrollArea>
					<TablePresensi
						attendances={presence?.attendances ?? []}
						onUpdateAction={updatingPresence}
					/>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</div>
	);
}
