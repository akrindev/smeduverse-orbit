"use client";

import { Separator } from "@/components/ui/separator";
import SelectRombel from "../../components/form/select-rombel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { usePresence } from "@/store/usePresence";
import { DateRange } from "react-day-picker";
import subDays from "date-fns/subDays";
import { DatePickerWithRange } from "./date-picker";
import { format } from "date-fns";
import id from "date-fns/locale/id";
import { is } from "date-fns/locale";
import BaseLoading from "@/components/base-loading";
import TableJournal from "./table-journal";
import { Presence } from "@/types/presence";

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
    <div className='flex flex-col h-full'>
      <div className='flex flex-col md:flex-row justify-between'>
        <div className='mt-5 space-y-1'>
          <h2 className='text-2xl font-semibold tracking-tight'>
            Rekap Jurnal Kelas
          </h2>
          <p className='text-sm text-muted-foreground'>
            Rekap jurnal kelas dalam kegiatan pembelajaran
          </p>
        </div>
      </div>
      <Separator className='my-5' />
      <div className='mb-5 grid grid-cols-12 gap-5'>
        <div className='col-span-12 md:col-span-3'>
          <div className='font-medium mb-3'>Pilih Rombel</div>
          <SelectRombel onSelected={(e) => setClassJournal(e)} />
        </div>

        <div className='col-span-12 md:col-span-3'>
          <div className='font-medium mb-3'>Jarak Tanggal</div>
          <DatePickerWithRange onSelect={setDate} />
        </div>
      </div>

      {loading ? <BaseLoading /> : <TableJournal journals={journals} />}
    </div>
  );
}
