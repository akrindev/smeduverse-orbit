"use client";

import { IconExternalLink } from "@tabler/icons-react";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import BaseLoading from "@/components/base-loading";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
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
	const [data, setData] = useState<AttendancePagination>();
	const [view, setView] = useState<"table" | "grid">("table");
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
						<CardHeader className="flex flex-row justify-between items-center">
							<div>
								<CardTitle>Rekap Kehadiran</CardTitle>
								<CardDescription>
									Daftar rekap kehadiran siswa berdasarkan tanggal
								</CardDescription>
							</div>
							<ViewSwitcher onViewChange={setView} />
						</CardHeader>
						<CardContent className="p-0">
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

	return (
		<div className="border rounded-md">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nama</TableHead>
						<TableHead>Presensi</TableHead>
						<TableHead className="flex justify-end items-center">
							Tanggal
						</TableHead>
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
												<div className="text-muted-foreground">
													{attendance.nipd} ({item.modul?.rombel?.nama || "-"})
													-{" "}
													<span
														className={cn({
															"text-green-500":
																attendance.presence?.status === "h",
															"text-red-500":
																attendance.presence?.status === "a" ||
																attendance.presence?.status === "b",
															"text-yellow-500":
																attendance.presence?.status === "s",
															"text-blue-500":
																attendance.presence?.status === "i",
														})}
													>
														{statusMap[attendance.presence?.status || "no"]}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="max-w-[150px] truncate">
											<Link href={`/modul/${item.modul?.uuid}`}>
												<div className="flex flex-col">
													<span className="text-gray-400 dark:text-gray-600">
														{item.modul?.mapel?.kode || ""}
													</span>
													<div>
														<span>{item.title}</span>
														{/* icon external link */}
														<IconExternalLink className="inline-block ml-2 w-3 h-3 text-blue-700" />
													</div>
												</div>
											</Link>
										</TableCell>
										<TableCell>
											<div className="flex justify-end items-center gap-3">
												<Calendar className="w-4 h-4 text-gray-400" />
												<span>
													{format(
														new Date(item.updated_at),
														"E, dd LLL y HH:mm",
														{
															locale: id,
														},
													)}
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

	return (
		<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
			{data.map((item: IAttendance) => (
				<Fragment key={item.uuid + nanoid()}>
					{item.attendances?.map((attendance: Attendance) => (
						<Card key={nanoid()} className="cursor-pointer">
							<CardHeader>
								<CardTitle>{attendance.fullname}</CardTitle>
								<CardDescription>
									{item.modul?.rombel?.nama} - {attendance.nipd}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col">
									<span>
										<span className="font-medium">Kelas:</span>{" "}
										{item.modul?.rombel?.nama || "-"}
									</span>
									<span
										className={cn({
											"text-green-500": attendance.presence?.status === "h",
											"text-red-500":
												attendance.presence?.status === "a" ||
												attendance.presence?.status === "b",
											"text-yellow-500": attendance.presence?.status === "s",
											"text-blue-500": attendance.presence?.status === "i",
										})}
									>
										<span className="font-medium">Status:</span>{" "}
										{statusMap[attendance.presence?.status || "no"]}
									</span>
									{attendance.presence?.notes && (
										<span className="text-muted-foreground">
											Catatan: {attendance.presence?.notes}
										</span>
									)}
									<Link href={`/modul/${item.modul?.uuid}`}>
										<div className="flex flex-col">
											<span className="text-gray-400 dark:text-gray-600">
												{item.modul?.mapel?.nama || ""}
											</span>
											<div>
												<span>{item.title}</span>
												<IconExternalLink className="inline-block ml-2 w-3 h-3 text-blue-700" />
											</div>
										</div>
									</Link>
									<div className="flex items-center gap-3">
										<Calendar className="w-4 h-4 text-gray-400" />
										<span>
											{format(new Date(item.date), "E, dd LLL y", {
												locale: id,
											})}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</Fragment>
			))}
		</div>
	);
}
