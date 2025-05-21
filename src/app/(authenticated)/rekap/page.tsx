"use client";

import { Separator } from "@/components/ui/separator";
import SelectAttendanceStatus from "./components/select-attendance-status";
import { useAttendance } from "@/store/useAttendance";
import { Fragment, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Attendance,
  AttendancePagination,
  IAttendance,
} from "@/types/attendance";
import { nanoid } from "nanoid";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import BaseLoading from "@/components/base-loading";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { Calendar } from "lucide-react";
import { DateRangeSelector } from "./components/date-range-selector";

export default function RekapPage() {
  const [status, setStatus] = useState("no");
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [data, setData] = useState<AttendancePagination>();

  const recapByDateRange = useAttendance((state) => state.getRecapByDateRange);

  useEffect(() => {
    setIsLoading(true);
    recapByDateRange({
      status,
      from: date?.from ? date.from : new Date(),
      to: date?.to,
    })
      // @ts-ignore
      .then((res) => setData(res.data))
      .finally(() => setIsLoading(false));
  }, [status, date]);

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
          <div className="col-span-12 md:col-span-3">
            <div className="mb-3 font-medium">Status kehadiran</div>
            <SelectAttendanceStatus onSelected={(value) => setStatus(value)} />
          </div>
          <div className="col-span-12 md:col-span-9">
            <DateRangeSelector onSelect={setDate} initialDateRange={date} />
          </div>
        </div>
        <Separator className="my-4" />
        {/* loop data with table */}
        {isLoading ? (
          <BaseLoading />
        ) : (
          <div className="border rounded-md">
            {data?.data && data.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Presensi</TableHead>
                    <TableHead className="flex justify-end items-center">
                      Tanggal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((item: IAttendance) => (
                    <Fragment key={item.uuid + nanoid()}>
                      {item.attendances ? (
                        item.attendances.map((attendance: Attendance) => (
                          <TableRow key={nanoid()}>
                            <TableCell>
                              <div className="flex flex-col">
                                <div className="font-medium">
                                  {attendance.fullname}
                                </div>
                                <div className="text-muted-foreground">
                                  {attendance.nipd}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{item.modul?.rombel?.nama}</TableCell>
                            <TableCell className="max-w-[130px] truncate">
                              {/* wrap with span then color it based status */}
                              <div className="flex flex-col">
                                <span
                                  className={cn({
                                    "text-green-500":
                                      attendance.presence?.status === "h",
                                    // red if status is a or b
                                    "text-red-500":
                                      attendance.presence?.status === "a" ||
                                      attendance.presence?.status === "b",
                                    "text-yellow-500":
                                      attendance.presence?.status === "s",
                                    "text-blue-500":
                                      attendance.presence?.status === "i",
                                  })}
                                >
                                  {attendance.presence?.status}
                                </span>
                                <span className="text-muted-foreground">
                                  {attendance.presence?.notes}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              <Link href={`/modul/${item.modul?.uuid}`}>
                                <div className="flex flex-col">
                                  <span className="text-gray-400 dark:text-gray-600">
                                    {item.modul?.mapel?.nama || ""}
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
                                  {format(new Date(item.date), "E, dd LLL y", {
                                    locale: id,
                                  })}
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
            ) : (
              <div className="flex flex-col justify-center items-center py-12">
                <div className="font-semibold text-xl">Tidak ada data</div>
                <div className="text-muted-foreground">
                  Tidak ada data kehadiran siswa
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
