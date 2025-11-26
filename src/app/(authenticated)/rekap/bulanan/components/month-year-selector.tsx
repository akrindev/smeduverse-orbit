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

const MONTHS = [
	{ value: 1, label: "Januari" },
	{ value: 2, label: "Februari" },
	{ value: 3, label: "Maret" },
	{ value: 4, label: "April" },
	{ value: 5, label: "Mei" },
	{ value: 6, label: "Juni" },
	{ value: 7, label: "Juli" },
	{ value: 8, label: "Agustus" },
	{ value: 9, label: "September" },
	{ value: 10, label: "Oktober" },
	{ value: 11, label: "November" },
	{ value: 12, label: "Desember" },
];

// Generate years from 2020 to current year + 1
const currentYear = new Date().getFullYear();
const YEARS = Array.from(
	{ length: currentYear - 2020 + 2 },
	(_, i) => 2020 + i,
);

interface MonthYearSelectorProps {
	month: number;
	year: number;
	onMonthChange: (month: number) => void;
	onYearChange: (year: number) => void;
}

export default function MonthYearSelector({
	month,
	year,
	onMonthChange,
	onYearChange,
}: MonthYearSelectorProps) {
	return (
		<div className="flex gap-3">
			<div className="flex-1">
				<div className="mb-3 font-medium">Bulan</div>
				<Select
					value={String(month)}
					onValueChange={(value) => onMonthChange(Number(value))}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Pilih Bulan" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Pilih Bulan</SelectLabel>
							{MONTHS.map((m) => (
								<SelectItem key={m.value} value={String(m.value)}>
									{m.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="flex-1">
				<div className="mb-3 font-medium">Tahun</div>
				<Select
					value={String(year)}
					onValueChange={(value) => onYearChange(Number(value))}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Pilih Tahun" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Pilih Tahun</SelectLabel>
							{YEARS.map((y) => (
								<SelectItem key={y} value={String(y)}>
									{y}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
