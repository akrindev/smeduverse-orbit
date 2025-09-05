"use client";

import BaseLoading from "@/components/base-loading";
import PaginationControls from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useClassJournalQuery } from "@/queries";
import { useRombel } from "@/store/useRombel";
import { IconDownload } from "@tabler/icons-react";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import SelectRombel from "../components/form/select-rombel";
import { DateRangeSelector } from "../rekap/components/date-range-selector";
import TablePresenceJournal from "./components/table-presence-journal";

export default function JurnalKelasPage() {
	const [classJournal, setClassJournal] = useState("");
	const [page, setPage] = useState(1);
	const [exportLoading, setExportLoading] = useState(false);
	const rombels = useRombel((state) => state.rombels);

	const [date, setDate] = useState<DateRange | undefined>({
		from: subDays(new Date(), 7),
		to: new Date(),
	});

	// Build filters for React Query
	const filters = classJournal
		? {
				rombel_id: classJournal,
				from: format(date?.from || new Date(), "yyyy-MM-dd"),
				to: date?.to ? format(date.to, "yyyy-MM-dd") : null,
				page,
			}
		: null;

	const { data: journalsResponse, isLoading } = useClassJournalQuery(filters);
	const journals = journalsResponse?.data || [];
	const currentPage = journalsResponse?.current_page || 1;
	const lastPage = journalsResponse?.last_page || 1;

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		// Scroll to top of page
		window.scrollTo(0, 0);
	};

	const handleExport = async () => {
		if (!classJournal) return;
		try {
			setExportLoading(true);
			const fromDate = date?.from ?? new Date();
			const toDate = date?.to;
			const formattedFrom = format(fromDate, "yyyy-MM-dd");
			const formattedTo = toDate ? format(toDate, "yyyy-MM-dd") : "";

			const rombelName = Array.isArray(rombels)
				? rombels.find((r: any) => r.id === classJournal)?.nama
				: undefined;
			const safeName = (rombelName || String(classJournal))
				.toString()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^a-zA-Z0-9-_]/g, "")
				.toLowerCase();

			const response = await api.post(
				"/modul/presence/recap/export/journal",
				{
					rombel_id: String(classJournal),
					from: formattedFrom,
					to: formattedTo,
				},
				{ responseType: "blob" },
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			const filename = `jurnal-kelas-${safeName}-${formattedFrom}${formattedTo ? `-${formattedTo}` : ""}.xlsx`;
			link.setAttribute("download", filename);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);
		} finally {
			setExportLoading(false);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<div className="flex md:flex-row flex-col justify-between">
				<div className="space-y-1 mt-5">
					<h2 className="font-semibold text-2xl tracking-tight">
						Jurnal Kelas
					</h2>
					<p className="text-muted-foreground text-sm">
						Rekap jurnal kelas dalam kegiatan pembelajaran
					</p>
				</div>
				<div className="mt-5">
					<Button
						variant="outline"
						onClick={handleExport}
						disabled={exportLoading || !classJournal}
					>
						{exportLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<div className="flex items-center gap-2">
								Unduh
								<IconDownload className="w-4 h-4" />
							</div>
						)}
					</Button>
				</div>
			</div>
			<Separator className="my-5" />
			<div className="gap-5 grid grid-cols-12 mb-5">
				<div className="col-span-12 md:col-span-3">
					<div className="mb-3 font-medium">Pilih Rombel</div>
					<SelectRombel onSelected={(e) => setClassJournal(e)} />
				</div>

				<div className="col-span-12 md:col-span-9">
					<DateRangeSelector onSelect={setDate} initialDateRange={date} />
				</div>
			</div>

			{isLoading ? (
				<BaseLoading />
			) : !classJournal ? (
				<div className="flex flex-col items-center bg-yellow-50 my-8 p-8 border rounded-md">
					<h3 className="mb-2 font-semibold text-yellow-800 text-lg">
						Pilih Kelas Terlebih Dahulu
					</h3>
					<p className="text-yellow-700 text-center">
						Silakan pilih rombongan belajar untuk menampilkan jurnal kelas.
					</p>
				</div>
			) : (
				<>
					<TablePresenceJournal data={journals} />

					{/* Pagination */}
					<div className="flex justify-center mt-4">
						<PaginationControls
							currentPage={currentPage}
							lastPage={lastPage}
							onPageChange={handlePageChange}
						/>
					</div>
				</>
			)}
		</div>
	);
}
