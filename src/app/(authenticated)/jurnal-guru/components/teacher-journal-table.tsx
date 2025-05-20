"use client";

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
import { useMemo } from "react";

interface TeacherJournalTableProps {
  journals: TeacherJournalEntry[];
}

export default function TeacherJournalTable({
  journals,
}: TeacherJournalTableProps) {
  // Define table columns
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

  // Initialize table
  const table = useReactTable({
    data: journals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Render empty state if no journals
  if (journals.length === 0) {
    return (
      <div className="p-8 border rounded-md">
        <div className="flex flex-col justify-center items-center text-center">
          <h3 className="font-medium text-lg">Belum ada data</h3>
          <p className="mt-1 text-muted-foreground text-sm">
            Tidak ada jurnal guru yang tersedia dengan filter yang dipilih
          </p>
        </div>
      </div>
    );
  }

  // Render table
  return (
    <div className="border rounded-md">
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
    </div>
  );
}
