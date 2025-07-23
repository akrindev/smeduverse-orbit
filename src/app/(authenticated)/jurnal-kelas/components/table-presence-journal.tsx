"use client";

import { useState } from "react";
import { IAttendance, Presence } from "@/types/attendance";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ViewSwitcher from "@/components/ui/view-switcher";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface TablePresenceJournalProps {
  data: IAttendance[];
}

export default function TablePresenceJournal({ data }: TablePresenceJournalProps) {
  const [view, setView] = useState<"table" | "grid">("table");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Jurnal Kelas</CardTitle>
          <CardDescription>Daftar jurnal kelas yang telah dibuat</CardDescription>
        </div>
        <ViewSwitcher onViewChange={setView} />
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          view === "table" ? (
            <PresenceJournalTable data={data} />
          ) : (
            <PresenceJournalGrid data={data} />
          )
        ) : (
          <div className="my-12 flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-semibold">Belum ada data</div>
              <div className="text-md font-normal">
                Tidak ada data untuk ditampilkan
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PresenceJournalTable({ data }: { data: IAttendance[] }) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Modul</TableHead>
          <TableHead>Judul</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Tanggal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((presence) => (
          <TableRow
            key={presence.uuid}
            onClick={() => router.push(`/rekap/presensi/${presence.uuid}`)}
            className="cursor-pointer"
          >
            <TableCell>
              <div className="flex flex-col">
                <div className="font-medium">{presence.modul?.mapel.nama}</div>
                <span className="text-muted-foreground">
                  {presence.modul?.teacher.fullname}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <div className="font-medium">{presence.title}</div>
                <span className="text-muted-foreground">
                  {presence.modul?.rombel?.nama}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <div className="text-muted-foreground">
                  {presence.description}
                </div>
                <span>{presence.description}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <div className="font-medium">
                  {format(new Date(presence.date), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </div>
                <span className="text-muted-foreground">
                  {presence.title}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PresenceJournalGrid({ data }: { data: IAttendance[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((presence) => (
        <Card
          key={presence.uuid}
          onClick={() => router.push(`/rekap/presensi/${presence.uuid}`)}
          className="cursor-pointer"
        >
          <CardHeader>
            <CardTitle>{presence.title}</CardTitle>
            <CardDescription>{presence.modul?.mapel.nama}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{presence.modul?.teacher.fullname}</p>
            <p>{presence.modul?.rombel?.nama}</p>
            <p>
              {format(new Date(presence.date), "dd MMMM yyyy", {
                locale: id,
              })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 