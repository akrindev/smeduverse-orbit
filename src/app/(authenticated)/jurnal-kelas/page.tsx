"use client";

import { Separator } from "@/components/ui/separator";
import SelectRombel from "../components/form/select-rombel";
import { useEffect, useState } from "react";
import { usePresence } from "@/store/usePresence";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import BaseLoading from "@/components/base-loading";
import { Presence } from "@/types/presence";
import { IAttendance } from "@/types/attendance";
import { DateRangeSelector } from "../rekap/components/date-range-selector";
import TablePresenceJournal from "./components/table-presence-journal";
import PaginationControls from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { IconDownload } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useRombel } from "@/store/useRombel";

export default function JurnalKelasPage() {
  const [classJournal, setClassJournal] = useState("");
  const [loading, setIsloading] = useState(false);
  const [page, setPage] = useState(1);
  const [exportLoading, setExportLoading] = useState(false);
  const rombels = useRombel((state) => state.rombels);

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const getJournal = usePresence((state) => state.getJournalKelas);
  const journals = usePresence((state) => state.journals);
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

      {loading ? (
        <BaseLoading />
      ) : !classJournal ? (
        <div className="flex flex-col items-center bg-yellow-50 my-8 p-8 border rounded-md">
          <h3 className="mb-2 font-semibold text-lg text-yellow-800">
            Pilih Kelas Terlebih Dahulu
          </h3>
          <p className="text-center text-yellow-700">
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
