"use client";

import { Separator } from "@/components/ui/separator";
import SelectAttendanceStatus from "./components/select-attendance-status";
import { DatePickerWithRange } from "./components/date-picker";
import { useAttendance } from "@/store/useAttendance";
import { FormEvent, Fragment, useCallback, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import subDays from "date-fns/subDays";
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
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import id from "date-fns/locale/id";
import BaseLoading from "@/components/base-loading";
import Link from "next/link";
import { IconExternalLink } from "@tabler/icons-react";
import { Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClassJournal from "./components/class-journal";

type TabsValue = "kehadiran" | "jurnal";

const TABS_VALUE: TabsValue[] = ["kehadiran", "jurnal"];

export default function RekapPage() {
  // active tabs state
  const [activeTab, setActiveTab] = useState<TabsValue>("kehadiran");
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
    <div className='h-full flex flex-col space-y-5'>
      <Tabs defaultValue={activeTab}>
        <TabsList>
          <TabsTrigger value='kehadiran'>Kehadiran</TabsTrigger>
          <TabsTrigger value='jurnal'>Jurnal Kelas</TabsTrigger>
        </TabsList>

        {/* tabs kehadiran */}
        <TabsContent value='kehadiran'>
          <div className='flex flex-col h-full'>
            <div className='flex flex-col md:flex-row justify-between'>
              <div className='mt-5 space-y-1'>
                <h2 className='text-2xl font-semibold tracking-tight'>
                  Rekap Kehadiran siswa
                </h2>
                <p className='text-sm text-muted-foreground'>
                  Rekap kehadiran siswa dalam kegiatan pembelajaran
                </p>
              </div>
            </div>
            <Separator className='my-4' />
            <div className='grid grid-cols-12 gap-5'>
              <div className='col-span-12 md:col-span-3'>
                <div className='font-medium mb-3'>Status kehadiran</div>
                <SelectAttendanceStatus
                  onSelected={(value) => setStatus(value)}
                />
              </div>
              <div className='col-span-12 md:col-span-3'>
                <div className='font-medium mb-3'>Jarak Tanggal</div>
                <DatePickerWithRange onSelect={setDate} />
              </div>
            </div>
            <Separator className='my-4' />
            {/* loop data with table */}
            {isLoading ? (
              <BaseLoading />
            ) : (
              <div className='rounded-md border'>
                {data?.data && data.data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Presensi</TableHead>
                        <TableHead className='flex items-center justify-end'>
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
                                  <div className='flex flex-col'>
                                    <div className='font-medium'>
                                      {attendance.fullname}
                                    </div>
                                    <div className='text-muted-foreground'>
                                      {attendance.nipd}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {item.modul?.rombel?.nama}
                                </TableCell>
                                <TableCell className='max-w-[130px] truncate'>
                                  {/* wrap with span then color it based status */}
                                  <div className='flex flex-col'>
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
                                      })}>
                                      {attendance.presence?.status}
                                    </span>
                                    <span className='text-muted-foreground'>
                                      {attendance.presence?.notes}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className='max-w-[150px] truncate'>
                                  <Link href={`/modul/${item.modul?.uuid}`}>
                                    <div className='flex flex-col'>
                                      <span className='text-gray-400 dark:text-gray-600'>
                                        {item.modul?.mapel?.nama || ""}
                                      </span>
                                      <div>
                                        <span>{item.title}</span>
                                        {/* icon external link */}
                                        <IconExternalLink className='inline-block w-3 h-3 ml-2 text-blue-700' />
                                      </div>
                                    </div>
                                  </Link>
                                </TableCell>
                                <TableCell>
                                  <div className='flex gap-3 items-center justify-end'>
                                    <Calendar className='w-4 h-4 text-gray-400' />
                                    <span>
                                      {format(
                                        new Date(item.date),
                                        "E, dd LLL y",
                                        {
                                          locale: id,
                                        }
                                      )}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow key={nanoid()}>
                              <TableCell colSpan={5}>
                                <div className='flex flex-col justify-center items-center'>
                                  <div className='text-2xl font-semibold'>
                                    Tidak ada data
                                  </div>
                                  <div className='text-muted-foreground'>
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
                  <div className='py-12 flex flex-col justify-center items-center'>
                    <div className='text-xl font-semibold'>Tidak ada data</div>
                    <div className='text-muted-foreground'>
                      Tidak ada data kehadiran siswa
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        {/* end: tabs kehadiran */}
        <TabsContent value='jurnal' className='h-full'>
          <ClassJournal />
        </TabsContent>
      </Tabs>
    </div>
  );
}
