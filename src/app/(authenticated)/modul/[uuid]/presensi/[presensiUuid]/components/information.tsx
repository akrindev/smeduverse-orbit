"use client";

import { useEffect, useState } from "react";
import DialogPresensi from "../../../components/dialog-presensi";
import { Presence } from "@/types/presence";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { IconReload } from "@tabler/icons-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Information({
  title,
  description,
  date,
  modulUuid,
  presenceUuid,
  presence,
  onRefresh,
  isLoading,
}: {
  title: string;
  description: string;
  date: Date | string | number;
  modulUuid: string;
  presenceUuid?: string;
  presence?: Presence;
  onRefresh?: () => void;
  isLoading?: boolean;
}) {
  // handle data state
  const [data, setData] = useState<{
    title: string;
    date: Date | string | number;
    description: string;
    presenceUuid?: string;
    subject_schedule_id?: string;
    subject_schedule_end_id?: string;
  }>();

  useEffect(() => {
    setData({
      title: title,
      description: description,
      date: date,
      presenceUuid: presenceUuid,
      subject_schedule_id: presence?.subject_schedule_id,
      subject_schedule_end_id: presence?.subject_schedule_end_id,
    });
  }, [title, description, date, presenceUuid, presence]);

  return (
    <div className="gap-3 grid grid-cols-12">
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Judul</div>
        <div className="text-muted-foreground text-sm">{data?.title}</div>
      </div>
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Deskripsi</div>
        <div className="text-muted-foreground text-sm">{data?.description}</div>
      </div>

      <div className="relative space-y-1 col-span-12 mt-5 w-full">
        <ScrollArea>
          <div className="font-medium">Rekap Kehadiran</div>
          <div className="flex flex-wrap gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Hadir</TableHead>
                  <TableHead className="whitespace-nowrap">Izin</TableHead>
                  <TableHead className="whitespace-nowrap">Sakit</TableHead>
                  <TableHead className="whitespace-nowrap">Alpa</TableHead>
                  <TableHead className="whitespace-nowrap">Bolos</TableHead>
                  <TableHead className="whitespace-nowrap">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <p className="font-medium text-green-600 dark:text-green-500">
                      {presence?.count_h}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-amber-600 dark:text-amber-500">
                      {presence?.count_i}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-blue-600 dark:text-blue-500">
                      {presence?.count_s}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-red-600 dark:text-red-500">
                      {presence?.count_a}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-rose-600 dark:text-rose-500">
                      {presence?.count_b}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-600 dark:text-slate-400">
                      {(presence?.count_h || 0) +
                        (presence?.count_i || 0) +
                        (presence?.count_s || 0) +
                        (presence?.count_a || 0) +
                        (presence?.count_b || 0)}
                    </p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex justify-between items-center gap-3 col-span-12 mt-3">
        <div className="flex items-center gap-3">
          <DialogPresensi modulUuid={modulUuid} data={data!} />
          <Button variant={"outline"} onClick={onRefresh} disabled={isLoading}>
            <IconReload className="w-5 h-5" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
