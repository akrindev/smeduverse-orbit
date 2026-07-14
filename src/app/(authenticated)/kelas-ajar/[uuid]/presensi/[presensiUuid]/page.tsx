"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { useKelasAjarQuery } from "@/queries/useKelasAjarQuery";
import { usePresenceQuery } from "@/queries/usePresenceQuery";
import { useAuth } from "@/store/useAuth";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Information from "./components/information";
import TablePresensi from "./components/table-presensi";

export default function PreseniPage() {
	const { uuid, presensiUuid } = useParams<{
		uuid: string;
		presensiUuid: string;
	}>();

	const router = useRouter();
	const { user } = useAuth();
	const { kelasAjarInfoQuery } = useKelasAjarQuery(uuid);
	const {
		data: presence,
		isLoading,
		error,
		refetch,
	} = usePresenceQuery(presensiUuid);

	// Handle 404 error
	useEffect(() => {
		if (error && error.message === "Presence not found") {
			toast({
				title: "Presensi tidak ditemukan",
				description: "Presensi yang anda cari tidak ditemukan",
			});
			router.push(`/kelas-ajar/${uuid}`);
		}
	}, [error, router, uuid]);

	// Redirect if current user is not the owner (teacher) of the module
	useEffect(() => {
		if (
			kelasAjarInfoQuery?.data &&
			user &&
			kelasAjarInfoQuery.data.teacher.teacher_id !== user.id
		) {
			router.push(`/rekap/presensi/${uuid}`);
		}
	}, [kelasAjarInfoQuery?.data, user, uuid, router]);

	const handleRefresh = () => {
		refetch();
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!presence) {
		return <div>Presence not found</div>;
	}

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
				onRefreshAction={handleRefresh}
				isLoading={isLoading}
			/>
			<div className="relative mt-5 border rounded-md w-full">
				<ScrollArea>
					<TablePresensi
						attendances={presence?.attendances ?? []}
						onUpdateAction={handleRefresh}
					/>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>
		</div>
	);
}
