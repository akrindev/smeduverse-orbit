"use client";

import { useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRombel } from "@/store/useRombel";

export default function SelectRombel({ className }: { className?: string }) {
	const { rombels, refetch, selectedRombelId, setSelectedRombelId } =
		useRombel();

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<Select
			value={selectedRombelId}
			onValueChange={(value: string) => setSelectedRombelId(value)}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Pilih Kelas" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Pilih Kelas</SelectLabel>
					<SelectItem value="all">Semua Kelas</SelectItem>
					{rombels?.map((rombel) => (
						<SelectItem key={rombel.id} value={rombel.id}>
							{rombel.nama}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
