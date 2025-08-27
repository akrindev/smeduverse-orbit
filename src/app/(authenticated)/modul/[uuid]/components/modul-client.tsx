"use client";

import { BookOpen, FileText, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useModulQuery } from "@/queries/useModulQuery";
import { useAuth } from "@/store/useAuth";
import DialogPresensi from "./dialog-presensi";
import TableListPresensi from "./table-list-presensi";

export default function ModulClient({ modulUuid }: { modulUuid: string }) {
	const router = useRouter();
	const { modulInfoQuery } = useModulQuery(modulUuid);
	const { user } = useAuth();

	// Move useEffect before any conditional returns to fix the React Hooks rule
	useEffect(() => {
		// Only run this check if we have data loaded and user data is available
		if (
			modulInfoQuery.data &&
			user &&
			modulInfoQuery.data.teacher.teacher_id !== user.id
		) {
			router.push(`/rekap/presensi/${modulUuid}`);
		}
	}, [modulInfoQuery.data, user, modulUuid, router]);

	// Handle loading state
	if (modulInfoQuery.isLoading) {
		return (
			<div className="flex justify-center items-center h-48">
				<Loader2 className="w-8 h-8 text-primary animate-spin" />
			</div>
		);
	}

	// Handle error state
	if (modulInfoQuery.isError) {
		return notFound();
	}

	const data = modulInfoQuery.data;

	// If no data returned
	if (!data) {
		return notFound();
	}

	return (
		<div className="space-y-6">
			<div className="gap-3 grid grid-cols-12">
				<div className="col-span-12 md:col-span-6">
					<h3 className="font-medium text-lg">Presensi</h3>
					<p className="text-muted-foreground text-sm">
						Daftar presensi yang telah dibuat
					</p>
				</div>
				<div className="flex justify-end items-center gap-3 col-span-12 md:col-span-6">
					<DialogPresensi modulUuid={modulUuid} />
					<Link href={`/rekap/presensi/${modulUuid}`}>
						<Button variant={`outline`}>
							<FileText className="w-4 h-4" />
							Rekap Presensi
						</Button>
					</Link>
				</div>
			</div>
			<Separator />

			<Separator />
			<Alert>
				<Info className="w-4 h-4" />
				<AlertTitle>Info</AlertTitle>
				<AlertDescription>
					Pilih presensi untuk mengelola status presensi siswa
				</AlertDescription>
			</Alert>
			<TableListPresensi modulUuid={modulUuid} />
		</div>
	);
}
