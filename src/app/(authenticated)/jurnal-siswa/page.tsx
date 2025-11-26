"use client";

import BaseLoading from "@/components/base-loading";
import PaginationControls from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { useStudentJournalsQuery } from "@/queries";
import { useAuth } from "@/store/useAuth";
import { IconDownload } from "@tabler/icons-react";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import SearchableRombelSelect from "../components/form/searchable-rombel-select";
import { DateRangeSelectorPair } from "../jurnal-guru/components/date-range-picker";
import StudentJournalTable from "./components/student-journal-table";

export default function StudentJournalPage() {
	// Filters state
	const [selectedRombel, setSelectedRombel] = useState<string>("");
	const [dateRange, setDateRange] = useState<DateRange | undefined>({
		from: subDays(new Date(), 7),
		to: new Date(),
	});
	const [page, setPage] = useState(1);
	const [exportLoading, setExportLoading] = useState<boolean>(false);

	// Get current user and student journals from React Query
	const { user: currentUser } = useAuth();

	// Build filters for query
	const filters = selectedRombel
		? {
				rombel_id: selectedRombel,
				from: format(dateRange?.from || new Date(), "yyyy-MM-dd"),
				to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : null,
				page,
			}
		: null;

	const { data: journalsResponse, isLoading } =
		useStudentJournalsQuery(filters);

	// On initial load, set the selected rombel to current user's rombel if they are a student
	useEffect(() => {
		if (currentUser?.student?.rombel_id) {
			setSelectedRombel(currentUser.student.rombel_id);
		}
	}, [currentUser]);

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		// Scroll to top of page
		window.scrollTo(0, 0);
	};

	const handleExport = async () => {
		if (!selectedRombel) return;
		try {
			setExportLoading(true);
			const fromDate = dateRange?.from ?? new Date();
			const toDate = dateRange?.to ?? undefined;
			const formattedFrom = format(fromDate, "yyyy-MM-dd");
			const formattedTo = toDate ? format(toDate, "yyyy-MM-dd") : undefined;

			const response = await api.get(
				"/modul/presence/recap/export/student-journal",
				{
					params: {
						rombel_id: selectedRombel,
						from: formattedFrom,
						...(formattedTo ? { to: formattedTo } : {}),
					},
					responseType: "blob",
				},
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			const filename = `jurnal-siswa-${formattedFrom}${formattedTo ? `-${formattedTo}` : ""}.xlsx`;
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
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				<div className="flex md:flex-row flex-col justify-between">
					<div className="space-y-1 mt-5">
						<h2 className="font-semibold text-2xl tracking-tight">
							Jurnal Siswa
						</h2>
						<p className="text-muted-foreground text-sm">
							Rekap jurnal kegiatan pembelajaran per siswa
						</p>
					</div>
					<div className="mt-5">
						<Button
							variant="outline"
							onClick={handleExport}
							disabled={exportLoading || !selectedRombel}
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

				{/* Filters */}
				<div className="gap-5 grid grid-cols-12 mb-5">
					<div className="col-span-12 md:col-span-4">
						<div className="mb-3 font-medium">Pilih Rombel</div>
						<SearchableRombelSelect
							onSelected={setSelectedRombel}
							defaultValue={selectedRombel}
						/>
					</div>

					<div className="col-span-12 md:col-span-8">
						<DateRangeSelectorPair
							onSelect={setDateRange}
							initialDateRange={dateRange}
						/>
					</div>
				</div>

				{/* Table */}
				{isLoading ? (
					<BaseLoading />
				) : !selectedRombel ? (
					<div className="flex flex-col items-center bg-yellow-50 my-8 p-8 border rounded-md">
						<h3 className="mb-2 font-semibold text-yellow-800 text-lg">
							Pilih Rombel Terlebih Dahulu
						</h3>
						<p className="text-yellow-700 text-center">
							Silakan pilih rombel untuk menampilkan jurnal siswa.
						</p>
					</div>
				) : (
					<>
						<StudentJournalTable data={journalsResponse!} />

						{/* Pagination */}
						<div className="flex justify-center mt-4">
							<PaginationControls
								currentPage={journalsResponse?.students.current_page || 1}
								lastPage={journalsResponse?.students.last_page || 1}
								onPageChange={handlePageChange}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
