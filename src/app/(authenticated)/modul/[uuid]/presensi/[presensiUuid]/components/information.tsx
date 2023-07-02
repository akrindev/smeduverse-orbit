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

export default function Information({
  title,
  description,
  modulUuid,
  presenceUuid,
  presence,
  onRefresh,
}: {
  title: string;
  description: string;
  modulUuid: string;
  presenceUuid?: string;
  presence?: Presence;
  onRefresh?: () => void;
}) {
  // handle data state
  const [data, setData] = useState<{
    title: string;
    description: string;
    presenceUuid?: string;
  }>();

  useEffect(() => {
    setData({
      title: title,
      description: description,
      presenceUuid: presenceUuid,
    });
  }, [title, description, presenceUuid]);

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Judul</div>
        <div className="text-sm text-muted-foreground">{data?.title}</div>
      </div>
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Deskripsi</div>
        <div className="text-sm text-muted-foreground">{data?.description}</div>
      </div>

      <div className="relative w-full mt-5 space-y-1 col-span-12">
        <ScrollArea>
          <div className="font-medium">Rekap Kehadiran</div>
          <div className="flex flex-wrap gap-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hadir</TableHead>
                  <TableHead>Izin</TableHead>
                  <TableHead>Sakit</TableHead>
                  <TableHead>Alpa</TableHead>
                  <TableHead>Bolos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <p className="text-muted-foreground">{presence?.count_h}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground">{presence?.count_i}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground">{presence?.count_s}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground">{presence?.count_a}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-muted-foreground">{presence?.count_b}</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="mt-3 flex items-center justify-end col-span-12 gap-3">
        <DialogPresensi modulUuid={modulUuid} data={data!} />
        <Button variant={"outline"} onClick={onRefresh}>
          <IconReload className="w-5 h-5" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
