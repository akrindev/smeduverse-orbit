"use client";

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

export default function MonitoringJournalClient() {
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
        <CardHeader>
          <CardTitle>Jurnal Guru Hari Ini</CardTitle>
          <CardDescription>
            Daftar jurnal guru yang dibuat hari ini
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {data?.data.map((journal) => (
                <JournalRow key={journal.uuid} journal={journal} />
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function JournalRow({ journal }: { journal: Journal }) {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/rekap/presensi/${journal.orbit_modul_uuid}`);
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
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            H: {journal.count_h}
          </Badge>
          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
            S: {journal.count_s}
          </Badge>
          <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
            I: {journal.count_i}
          </Badge>
          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
            A: {journal.count_a}
          </Badge>
          <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50">
            B: {journal.count_b}
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  );
}