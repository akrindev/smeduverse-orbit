"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import BaseLoading from "@/components/base-loading";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ViewSwitcher from "@/components/ui/view-switcher";
import { cn } from "@/lib/utils";
import { useAttendance } from "@/store/useAttendance";
import type { Attendance, OrbitPresence } from "@/types/attendance";
import SheetDetailAttendance from "./sheet-detail-attendance";

interface TableAttendancesProps {
	modulUuid: string;
}

export default function TableAttendances({ modulUuid }: TableAttendancesProps) {
	const [data, setData] = useState<Attendance[]>([]);
	//   counted by first student orbit_presence
	const [orbitPresence, setOrbitPresence] = useState<OrbitPresence[]>([]);
	const [view, setView] = useState<"table" | "grid">("table");

	const getRecapAttendances = useAttendance(
		(state) => state.getRecapAttendances,
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
        //   Match by stable identifiers instead of index to handle missing entries
        cell: (cell) => {
          const rowPresenceList = cell.row.original.orbit_presence || [];

          const matchedPresence = rowPresenceList.find((p: OrbitPresence) => {
            const sameSession =
              p.uuid === presence.uuid ||
              p.presence?.orbit_presence_uuid ===
                presence.presence?.orbit_presence_uuid;
            const sameModule = p.orbit_modul_uuid === presence.orbit_modul_uuid;
            return sameSession && sameModule;
          });

          const status = (matchedPresence?.presence?.status || "").toUpperCase();

          // colors the status
          const colors = [
            { status: "H", color: "text-green-500" },
            { status: "S", color: "text-yellow-500" },
            { status: "I", color: "text-blue-500" },
            { status: "A", color: "text-red-500" },
            { status: "B", color: "text-red-500" },
          ];

          const matchedColor =
            colors.find((color) => color.status === status)?.color || "";

          const displayStatus = status || "-";
          return <div className={`${matchedColor} font-medium`}>{displayStatus}</div>;
        },
      })),
			{
				header: "Rekap",
				accessorKey: "status_count",
				cell: (cell) => {
					return (
						<div className="flex gap-3">
							{Object.entries(cell.row.original?.status_count || {}).map(
								([key, value]) => {
									const colors = {
										H: "bg-green-500",
										S: "bg-yellow-500",
										I: "bg-blue-500",
										A: "bg-red-500",
										B: "bg-red-500",
									};

									const matchedColor = colors[key.toUpperCase()];

									return (
										<Badge
											variant={"outline"}
											className={matchedColor}
											key={key}
										>
											{key.toUpperCase()}: {value}
										</Badge>
									);
								},
							)}
						</div>
					);
				},
			},
		],
		[orbitPresence],
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
          const attendances: Attendance[] = res.data;
          setData(attendances);

          // Build a union of all presence sessions across students to avoid relying on index
          const presenceMap = new Map<string, OrbitPresence>();
          attendances.forEach((attendance) => {
            (attendance.orbit_presence || [])
              .filter((p: OrbitPresence) => p.orbit_modul_uuid === modulUuid)
              .forEach((p: OrbitPresence) => {
                if (!presenceMap.has(p.uuid)) {
                  presenceMap.set(p.uuid, p);
                }
              });
          });

          const unifiedPresence = Array.from(presenceMap.values()).sort((a, b) => {
            const aDate = new Date(a.created_at || 0).getTime();
            const bDate = new Date(b.created_at || 0).getTime();
            return aDate - bDate;
          });

          setOrbitPresence(unifiedPresence);
        }
      })
      .catch(() => {
        // no-op
      });
  }, [modulUuid, getRecapAttendances]);

	if (!data.length) return <BaseLoading />;

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>Daftar Kehadiran</CardTitle>
					<CardDescription>
						Daftar kehadiran siswa berdasarkan modul
					</CardDescription>
				</div>
				<ViewSwitcher onViewChange={setView} />
			</CardHeader>
			<CardContent>
            {data.length > 0 ? (
                view === "table" ? (
                    <AttendanceDetailTable data={data} columns={columns} />
                ) : (
                    <AttendanceDetailGrid
                        data={data}
                        columns={columns}
                        modulUuid={modulUuid}
                    />
                )
            ) : (
					<div className="flex justify-center items-center my-12 h-full">
						<div className="flex flex-col items-center">
							<div className="font-semibold text-2xl">Belum ada data</div>
							<div className="font-normal text-md">
								Tidak ada data untuk ditampilkan
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

interface AttendanceDetailTableProps {
    data: Attendance[];
    columns: ColumnDef<Attendance>[];
}

function AttendanceDetailTable({ data, columns }: AttendanceDetailTableProps) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
		<div className="border rounded-md">
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
												header.getContext(),
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
			{/* <ScrollBar orientation='horizontal' /> */}
		</div>
	);
}

function AttendanceDetailGrid({ data, columns, modulUuid }: AttendanceDetailTableProps & { modulUuid?: string }) {
	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{data.map((attendance: Attendance) => (
				<Card key={attendance.student_id} className="cursor-pointer">
					<CardHeader>
						<CardTitle>{attendance.fullname}</CardTitle>
						<CardDescription>{attendance.nipd}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col">
							{Object.entries(attendance.status_count!).map(([key, value]) => (
								<Badge variant={"outline"} key={key}>
									{key.toUpperCase()}: {value}
								</Badge>
							))}
						</div>
                        <div className="mt-2 text-muted-foreground text-sm">
                            {attendance.orbit_presence && attendance.orbit_presence.length > 0 && (
                                (() => {
                                    const latest = attendance.orbit_presence
                                        .filter((p: OrbitPresence) => !modulUuid || p.orbit_modul_uuid === modulUuid)
                                        .sort((a: OrbitPresence, b: OrbitPresence) =>
                                            new Date(b.presence?.created_at || 0).getTime() -
                                            new Date(a.presence?.created_at || 0).getTime(),
                                        )[0];
                                    return latest ? (
                                        <p>
                                            Terakhir presensi:
                                            {format(new Date(latest.presence.created_at), "dd MMMM yyyy", { locale: id })}
                                        </p>
                                    ) : null;
                                })()
                            )}
                        </div>
						<SheetDetailAttendance attendance={attendance} />
					</CardContent>
				</Card>
			))}
		</div>
	);
}
