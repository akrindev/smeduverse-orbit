"use client";

import { useState } from "react";
import { MonitorJournal, Journal } from "@/types/monitor";
import { useMonitorJournalQuery } from "@/queries/useMonitorJournalQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import ViewSwitcher from "@/components/ui/view-switcher";

export default function MonitoringJournalClient() {
  const [view, setView] = useState<"table" | "grid">("table");
  const { todayJournalQuery } = useMonitorJournalQuery(10000);
  const { data, isLoading, error } = todayJournalQuery;

  if (isLoading) {
    return <div className="py-8 text-center">Memuat data jurnal...</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-red-500 text-center">
        Gagal memuat data jurnal
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Jurnal Guru Hari Ini</CardTitle>
            <CardDescription>
              Daftar jurnal guru yang dibuat hari ini
            </CardDescription>
          </div>
          <ViewSwitcher onViewChange={setView} />
        </CardHeader>
        <CardContent>
          {view === "table" ? (
            <JournalTable data={data?.data ?? []} />
          ) : (
            <JournalGrid data={data?.data ?? []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function JournalTable({ data }: { data: Journal[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Guru</TableHead>
          <TableHead>Mata Pelajaran</TableHead>
          <TableHead>Rombel</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Kehadiran</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((journal) => (
          <JournalRow key={journal.uuid} journal={journal} />
        ))}
      </TableBody>
    </Table>
  );
}

function JournalRow({ journal }: { journal: Journal }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/rekap/presensi/${journal.uuid}`);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{journal.modul.teacher.fullname}</div>
        <div className="text-sm text-muted-foreground">
          {journal.modul.teacher.niy}
        </div>
      </TableCell>
      <TableCell
        className="cursor-pointer hover:underline"
        onClick={handleNavigate}
      >
        {journal.modul.mapel.nama}
      </TableCell>
      <TableCell>{journal.modul.rombel.nama}</TableCell>
      <TableCell>
        {journal.start_time} - {journal.end_time}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Badge variant="outline">H: {journal.count_h}</Badge>
          <Badge variant="outline">S: {journal.count_s}</Badge>
          <Badge variant="outline">I: {journal.count_i}</Badge>
          <Badge variant="outline">A: {journal.count_a}</Badge>
          <Badge variant="outline">B: {journal.count_b}</Badge>
        </div>
      </TableCell>
    </TableRow>
  );
}

function JournalGrid({ data }: { data: Journal[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((journal) => (
        <Card
          key={journal.uuid}
          className="cursor-pointer"
          onClick={() => router.push(`/rekap/presensi/${journal.uuid}`)}
        >
          <CardHeader>
            <CardTitle>{journal.modul.mapel.nama}</CardTitle>
            <CardDescription>{journal.modul.rombel.nama}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="font-medium">{journal.modul.teacher.fullname}</p>
              <p className="text-sm text-muted-foreground">
                {journal.modul.teacher.niy}
              </p>
            </div>
            <p>
              {journal.start_time} - {journal.end_time}
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline">H: {journal.count_h}</Badge>
              <Badge variant="outline">S: {journal.count_s}</Badge>
              <Badge variant="outline">I: {journal.count_i}</Badge>
              <Badge variant="outline">A: {journal.count_a}</Badge>
              <Badge variant="outline">B: {journal.count_b}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}