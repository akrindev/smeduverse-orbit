"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAttendance } from "@/store/useAttendance";
import { Attendance, OrbitPresence } from "@/types/attendance";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { memo, useEffect, useMemo, useState } from "react";

interface TableAttendancesProps {
  modulUuid: string;
}

export default function TableAttendances({ modulUuid }: TableAttendancesProps) {
  const [data, setData] = useState<Attendance[]>([]);
  //   counted by first student orbit_presence
  const [orbitPresence, setOrbitPresence] = useState<OrbitPresence[]>([]);

  const getRecapAttendances = useAttendance(
    (state) => state.getRecapAttendances
  );

  const columns: ColumnDef<Attendance>[] = [
    {
      header: "No",
      cell: (cell) => cell.row.index + 1,
      size: 1,
    },
    {
      header: "Nama",
      accessorKey: "fullname",
      cell: (cell) =>
        `${cell.row.original.nipd} - ${cell.row.original.fullname}`,
    },
    {
      header: "Kehadiran",
      columns: [
        ...orbitPresence.map((presence, i) => ({
          header: () => i + 1,
          accessorKey: presence.uuid,

          //   the cell is the presence status coming from orbit_presence
          cell: (cell) => {
            const status =
              cell.row.original.orbit_presence[
                i
              ]?.presence.status.toUpperCase() || "";

            // colors the status
            const colors = [
              { status: "H", color: "text-green-500" },
              { status: "S", color: "text-yellow-500" },
              { status: "I", color: "text-blue-500" },
              { status: "A", color: "text-red-500" },
              { status: "B", color: "text-red-500" },
            ];

            const matchedColor = colors.find(
              (color) => color.status === status
            )?.color;

            return (
              <div className={`${matchedColor} font-medium`}>{status}</div>
            );
          },
        })),
      ],
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    getRecapAttendances(modulUuid)
      .then((res) => {
        if (res.status === 200) {
          // @ts-ignore
          setData(res.data);

          //   set countedPresence by the first student orbit_presence
          setOrbitPresence(res.data[0].orbit_presence);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [modulUuid, getRecapAttendances, setData]);

  return (
    <div>
      <div className="rounded-md border">
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
    </div>
  );
}
