"use client";

import BaseLoading from "@/components/base-loading";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useAttendance } from "@/store/useAttendance";
import { Attendance, OrbitPresence } from "@/types/attendance";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import SheetDetailAttendance from "./sheet-detail-attendance";

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

  const columns: ColumnDef<Attendance>[] = useMemo(
    () => [
      {
        header: "No",
        cell: (cell) => cell.row.index + 1,
        maxSize: 50,
      },
      {
        header: "Nama",
        accessorKey: "fullname",
        cell: (cell) => (
          <SheetDetailAttendance attendance={cell.row.original} />
        ),
      },
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

          return <div className={`${matchedColor} font-medium`}>{status}</div>;
        },
      })),
      {
        header: "Rekap",
        accessorKey: "status_count",
        cell: (cell) => {
          return (
            <div className="flex gap-3">
              {Object.entries(cell.row.original.status_count!).map(
                ([key, value]) => (
                  <Badge variant={"outline"} key={key}>
                    {key.toUpperCase()}: {value}
                  </Badge>
                )
              )}
            </div>
          );
        },
      },
    ],
    [orbitPresence]
  );

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

  if (!data.length) return <BaseLoading />;

  return (
    <div>
      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="p-2"
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
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
                  <TableCell
                    key={cell.id}
                    className={cn({
                      "p-2 whitespace-nowrap": true,
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
