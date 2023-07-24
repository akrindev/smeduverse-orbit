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

export default function ClassJournal() {
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
          <SelectRombel onSelected={(e) => console.log(e)} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Modul</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Deskripsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <div className='flex flex-col'>
                <div className='font-medium'>PAI</div>
                <span className='text-muted-foreground'>
                  Alim Assidiq, S.Pd
                </span>
              </div>
            </TableCell>
            <TableCell>Perkenalan Pertama</TableCell>
            <TableCell>Pengenalan siswa</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
