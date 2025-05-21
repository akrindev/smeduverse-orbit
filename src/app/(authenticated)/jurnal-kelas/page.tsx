"use client";

import { Separator } from "@/components/ui/separator";
import SelectRombel from "../components/form/select-rombel";
import { useEffect, useState } from "react";
import { usePresence } from "@/store/usePresence";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import BaseLoading from "@/components/base-loading";
import { Presence } from "@/types/presence";
import { DateRangeSelector } from "../rekap/components/date-range-selector";
import TableJournal from "../rekap/components/table-journal";
import PaginationControls from "@/components/pagination-controls";

export default function JurnalKelasPage() {
  const [classJournal, setClassJournal] = useState("");
  const [loading, setIsloading] = useState(false);
  const [page, setPage] = useState(1);

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const getJournal = usePresence((state) => state.getJournalKelas);
  const journals = usePresence<Presence[]>((state) => state.journals);
  const currentPage = usePresence((state) => state.currentPage);
  const lastPage = usePresence((state) => state.lastPage);

  useEffect(() => {
    setIsloading(true);

    getJournal({
      rombel_id: classJournal,
      from: date?.from ? date.from : new Date(),
      to: date?.to,
      page,
    }).finally(() => setIsloading(false));
  }, [classJournal, date, page]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of page
    window.scrollTo(0, 0);
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

      {loading ? (
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
          <TableJournal journals={journals} />

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
