"use client";

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
import { useEffect } from "react";

interface SelectRombelRequiredProps {
	value: string;
	onValueChange: (value: string) => void;
}

export default function SelectRombelRequired({
	value,
	onValueChange,
}: SelectRombelRequiredProps) {
	const { rombels, refetch } = useRombel();

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Pilih Kelas" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Pilih Kelas</SelectLabel>
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
