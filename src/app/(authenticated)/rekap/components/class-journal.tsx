"use client";

import { Separator } from "@/components/ui/separator";
import SelectRombel from "../../components/form/select-rombel";
import { useEffect, useState } from "react";
import { usePresence } from "@/store/usePresence";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import BaseLoading from "@/components/base-loading";
import TableJournal from "./table-journal";
import { Presence } from "@/types/presence";
import { DateRangeSelector } from "./date-range-selector";

export default function ClassJournal() {
  const [classJournal, setClassJournal] = useState("");
  const [loading, setIsloading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 1),
    to: new Date(),
  });

  const getJournal = usePresence((state) => state.getJournalKelas);

  const journals = usePresence<Presence[]>((state) => state.journals);

  useEffect(() => {
    // set loading
    setIsloading(true);

    getJournal({
      rombel_id: classJournal,
      from: date?.from ? date.from : new Date(),
      to: date?.to,
    }).finally(() => setIsloading(false));
  }, [classJournal, date]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex md:flex-row flex-col justify-between">
        <div className="space-y-1 mt-5">
          <h2 className="font-semibold text-2xl tracking-tight">
            Rekap Jurnal Kelas
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

      {loading ? <BaseLoading /> : <TableJournal data={journals} />}
    </div>
  );
}
