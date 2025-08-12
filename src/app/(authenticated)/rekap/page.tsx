"use client";

import { IconDownload, IconExternalLink } from "@tabler/icons-react";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import BaseLoading from "@/components/base-loading";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ViewSwitcher from "@/components/ui/view-switcher";
import { useView } from "@/store/useView";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAttendance } from "@/store/useAttendance";
import { useRombel } from "@/store/useRombel";
import type {
	Attendance,
	AttendancePagination,
	IAttendance,
} from "@/types/attendance";
import { DateRangeSelector } from "./components/date-range-selector";
import SelectAttendanceStatus from "./components/select-attendance-status";
import SelectRombel from "./components/select-rombel";


export default function RekapPage() {
	const [status, setStatus] = useState("no");
	const [isLoading, setIsLoading] = useState(false);
	const [date, setDate] = useState<DateRange | undefined>({
		from: subDays(new Date(), 7),
		to: new Date(),
	});
    const [exportLoading, setExportLoading] = useState<boolean>(false);
    const [data, setData] = useState<AttendancePagination>();
    const { selectedView: view } = useView();
	const rombelId = useRombel((state) => state.selectedRombelId);

	const recapByDateRange = useAttendance((state) => state.getRecapByDateRange);

	useEffect(() => {
		setIsLoading(true);
		recapByDateRange({
			status,
			from: date?.from ? date.from : new Date(),
			to: date?.to,
			rombel_id: rombelId,
		})
			// @ts-ignore
			.then((res) => setData(res.data))
			.finally(() => setIsLoading(false));
	}, [status, date, rombelId, recapByDateRange]);

    const handleExport = async () => {
        try {
            setExportLoading(true);
            const fromDate = date?.from ?? new Date();
            const toDate = date?.to ?? undefined;
            const formattedFrom = format(fromDate, "yyyy-MM-dd");
            const formattedTo = toDate ? format(toDate, "yyyy-MM-dd") : "";

            const response = await api.post(
                "/modul/presence/recap/export/date-range",
                {
                    status,
                    from: formattedFrom,
                    to: formattedTo,
                    rombel_id: rombelId ? String(rombelId) : "",
                },
                { responseType: "blob" },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            const filename = `rekap-presensi-${status}-${formattedFrom}${formattedTo ? `-${formattedTo}` : ""}.xlsx`;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } finally {
            setExportLoading(false);
        }
    };

	return (
		<div className="flex flex-col space-y-5 h-full">
			<div className="flex flex-col h-full">
				<div className="flex md:flex-row flex-col justify-between">
					<div className="space-y-1 mt-5">
						<h2 className="font-semibold text-2xl tracking-tight">
							Rekap Kehadiran siswa
						</h2>
						<p className="text-muted-foreground text-sm">
							Rekap kehadiran siswa dalam kegiatan pembelajaran
						</p>
					</div>
				</div>
				<Separator className="my-4" />
				<div className="gap-5 grid grid-cols-12">
					<div className="flex gap-3 col-span-12 md:col-span-6">
						<div className="flex-1">
							<div className="mb-3 font-medium">Status kehadiran</div>
							<SelectAttendanceStatus
								onSelected={(value) => setStatus(value)}
							/>
						</div>
						<div className="flex-1">
							<div className="mb-3 font-medium">Kelas</div>
							<SelectRombel />
						</div>
					</div>
					<div className="col-span-12 md:col-span-6">
						<DateRangeSelector onSelect={setDate} initialDateRange={date} />
					</div>
				</div>
                <Separator className="my-4" />
                {/* loop data with table */}
				{isLoading ? (
					<BaseLoading />
				) : (
                    <Card>
                        <CardHeader className="flex md:flex-row flex-col justify-between items-center">
							<div>
                                <CardTitle>Rekap Kehadiran</CardTitle>
                                <CardDescription>
                                    {`Daftar rekap kehadiran siswa berdasarkan tanggal${data?.data ? ` (${data.data.length} data)` : ""}`}
                                </CardDescription>
							</div>
                            <div className="flex items-center gap-2">
                                <Button onClick={handleExport} disabled={exportLoading}>
                                    {exportLoading ? (
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                    ) : (
                                        <IconDownload className="mr-2 w-4 h-4" />
                                    )}
                                    Unduh
                                </Button>
                                <ViewSwitcher withLabels />
                            </div>
						</CardHeader>
						<CardContent>
							{data?.data && data.data.length > 0 ? (
								view === "table" ? (
									<AttendanceTable data={data.data} />
								) : (
									<AttendanceGrid data={data.data} />
								)
							) : (
								<div className="flex flex-col justify-center items-center py-12">
									<div className="font-semibold text-xl">Tidak ada data</div>
									<div className="text-muted-foreground">
										Tidak ada data kehadiran siswa
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}

interface AttendanceTableProps {
	data: IAttendance[];
}

function AttendanceTable({ data }: AttendanceTableProps) {
	const statusMap: { [key: string]: string } = {
		h: "Hadir",
		a: "Alpa",
		b: "Bolos",
		s: "Sakit",
		i: "Izin",
		no: "Tidak Hadir",
	};

    const statusStyle = (status?: string) => {
        switch (status) {
            case "h":
                return "bg-green-50 text-green-700 border-green-200";
            case "a":
            case "b":
                return "bg-red-50 text-red-700 border-red-200";
            case "s":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "i":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-muted text-foreground";
        }
    };

	return (
		<div className="border rounded-md">
			<Table>
				<TableHeader>
					<TableRow>
                        <TableHead className="whitespace-nowrap">Nama Siswa</TableHead>
                        <TableHead className="hidden whitespace-nowrap md:table-cell">Kelas</TableHead>
                        <TableHead className="hidden whitespace-nowrap md:table-cell">Mata Pelajaran</TableHead>
                        <TableHead className="whitespace-nowrap">Status</TableHead>
                        <TableHead className="hidden whitespace-nowrap md:table-cell">Pertemuan</TableHead>
                        <TableHead className="hidden whitespace-nowrap md:table-cell">Tanggal</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((item: IAttendance) => (
						<Fragment key={item.uuid + nanoid()}>
							{item.attendances ? (
								item.attendances.map((attendance: Attendance) => (
									<TableRow key={nanoid()}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="font-medium">{attendance.fullname}</div>
                                                <div className="text-muted-foreground text-xs">{attendance.nipd}</div>
                                                <div className="space-y-0.5 md:hidden mt-1">
                                                    <div className="text-muted-foreground text-xs">
                                                        {item.modul?.mapel?.kode || "-"}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        {item.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{item.modul?.rombel?.nama || "-"}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.modul?.mapel?.kode || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("whitespace-nowrap", statusStyle(attendance.presence?.status))}>
                                                {statusMap[attendance.presence?.status || "no"]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden max-w-[180px] truncate md:table-cell">
                                            <Link href={`/modul/${item.modul?.uuid}`} className="hover:underline">
                                                <div className="flex items-center">
                                                    <span>{item.title}</span>
                                                    <IconExternalLink className="inline-block ml-2 w-3 h-3 text-blue-700" />
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span>
                                                    {format(new Date(item.updated_at), "E, dd LLL y HH:mm", { locale: id })}
                                                </span>
                                            </div>
                                        </TableCell>
									</TableRow>
								))
							) : (
								<TableRow key={nanoid()}>
									<TableCell colSpan={5}>
										<div className="flex flex-col justify-center items-center">
											<div className="font-semibold text-2xl">
												Tidak ada data
											</div>
											<div className="text-muted-foreground">
												Tidak ada data kehadiran siswa
											</div>
										</div>
									</TableCell>
								</TableRow>
							)}
						</Fragment>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function AttendanceGrid({ data }: AttendanceTableProps) {
	const statusMap: { [key: string]: string } = {
		h: "Hadir",
		a: "Alpa",
		b: "Bolos",
		s: "Sakit",
		i: "Izin",
		no: "Tidak Hadir",
	};

    const statusStyle = (status?: string) => {
        switch (status) {
            case "h":
                return "bg-green-50 text-green-700 border-green-200";
            case "a":
            case "b":
                return "bg-red-50 text-red-700 border-red-200";
            case "s":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "i":
                return "bg-blue-50 text-blue-700 border-blue-200";
            default:
                return "bg-muted text-foreground";
        }
    };

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{data.map((item: IAttendance) => (
				<Fragment key={item.uuid + nanoid()}>
					{item.attendances?.map((attendance: Attendance) => (
                        <Card key={nanoid()}>
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <CardTitle className="text-base md:text-lg">{attendance.fullname}</CardTitle>
                                        <CardDescription>{attendance.nipd}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className={cn(statusStyle(attendance.presence?.status))}>
                                        {statusMap[attendance.presence?.status || "no"]}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="text-sm">
                                    <span className="font-medium">Kelas:</span> {item.modul?.rombel?.nama || "-"}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Mata Pelajaran:</span> {item.modul?.mapel?.nama || "-"}
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium">Pertemuan:</span> {item.title}
                                </div>
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t text-sm">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>
                                        {format(new Date(item.updated_at), "E, dd LLL y HH:mm", { locale: id })}
                                    </span>
                                </div>
                                <Link href={`/modul/${item.modul?.uuid}`} className="inline-flex items-center gap-1 text-blue-700 text-sm hover:underline">
                                    <span>Lihat detail</span>
                                    <IconExternalLink className="w-3 h-3" />
                                </Link>
                            </CardContent>
                        </Card>
					))}
				</Fragment>
			))}
		</div>
	);
}
