"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TeacherJournalEntry } from "@/store/useTeacherJournal";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { CalendarIcon, Clock, ExternalLink } from "lucide-react";
import ViewSwitcher from "@/components/ui/view-switcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TeacherJournalTableProps {
  journals: TeacherJournalEntry[];
}

export default function TeacherJournalTable({ journals }: TeacherJournalTableProps) {
  const [view, setView] = useState<"table" | "grid">("table");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Jurnal Guru</CardTitle>
          <CardDescription>Daftar jurnal guru yang telah dibuat</CardDescription>
        </div>
        <ViewSwitcher onViewChange={setView} />
      </CardHeader>
      <CardContent>
        {journals.length === 0 ? (
          <div className="p-8 border rounded-md">
            <div className="flex flex-col justify-center items-center text-center">
              <h3 className="font-medium text-lg">Belum ada data</h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Tidak ada jurnal guru yang tersedia dengan filter yang dipilih
              </p>
            </div>
          </div>
        ) : view === "table" ? (
          <JournalTable journals={journals} />
        ) : (
          <JournalGrid journals={journals} />
        )}
      </CardContent>
    </Card>
  );
}

function JournalTable({ journals }: { journals: TeacherJournalEntry[] }) {
  const columns: ColumnDef<TeacherJournalEntry>[] = useMemo(
    () => [
      {
        header: "Modul",
        accessorKey: "modul",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <div className="font-medium">{row.original.modul.mapel.nama}</div>
            <span className="text-muted-foreground">
              {row.original.modul.teacher.fullname} (
              {row.original.modul.teacher.niy})
            </span>
          </div>
        ),
      },
      {
        header: "Kelas",
        accessorKey: "modul.rombel.nama",
        cell: ({ row }) => row.original.modul.rombel.nama,
      },
      {
        header: "Topik",
        accessorKey: "title",
        cell: ({ row }) => (
          <Link
            href={`/modul/${row.original.orbit_modul_uuid}/presensi/${row.original.uuid}`}
            className="hover:underline"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1 font-medium">
                {row.original.title}
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-muted-foreground line-clamp-1">
                {row.original.description}
              </span>
            </div>
          </Link>
        ),
      },
      {
        header: "Tanggal",
        accessorKey: "date",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <span>
              {format(new Date(row.original.date), "E, dd MMMM yyyy", {
                locale: id,
              })}
            </span>
          </div>
        ),
      },
      {
        header: "Waktu",
        accessorKey: "time",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>
              {row.original.start_time} - {row.original.end_time}
            </span>
          </div>
        ),
      },
      {
        header: "Kehadiran",
        accessorKey: "attendance",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="bg-green-50 hover:bg-green-50 text-green-700"
            >
              H: {row.original.count_h}
            </Badge>
            <Badge
              variant="outline"
              className="bg-yellow-50 hover:bg-yellow-50 text-yellow-700"
            >
              S: {row.original.count_s}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 hover:bg-blue-50 text-blue-700"
            >
              I: {row.original.count_i}
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-50 hover:bg-red-50 text-red-700"
            >
              A: {row.original.count_a}
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-50 hover:bg-red-50 text-red-700"
            >
              B: {row.original.count_b}
            </Badge>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: journals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function JournalGrid({ journals }: { journals: TeacherJournalEntry[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {journals.map((journal) => (
        <Link
          href={`/modul/${journal.orbit_modul_uuid}/presensi/${journal.uuid}`}
          key={journal.uuid}
        >
          <Card className="cursor-pointer">
            <CardHeader>
              <CardTitle>{journal.title}</CardTitle>
              <CardDescription>{journal.modul.mapel.nama}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{journal.modul.teacher.fullname}</p>
              <p>{journal.modul.rombel.nama}</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span>
                  {format(new Date(journal.date), "E, dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>
                  {journal.start_time} - {journal.end_time}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="bg-green-50 hover:bg-green-50 text-green-700"
                >
                  H: {journal.count_h}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-yellow-50 hover:bg-yellow-50 text-yellow-700"
                >
                  S: {journal.count_s}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 hover:bg-blue-50 text-blue-700"
                >
                  I: {journal.count_i}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-50 hover:bg-red-50 text-red-700"
                >
                  A: {journal.count_a}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-50 hover:bg-red-50 text-red-700"
                >
                  B: {journal.count_b}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
