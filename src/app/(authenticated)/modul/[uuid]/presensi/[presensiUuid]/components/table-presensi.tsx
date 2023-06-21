"use client";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Attendance } from "@/types/attendance";
import { ChevronDown } from "lucide-react";

export default function TablePresensi({
  attendances,
}: {
  attendances: Attendance[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>NIS</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances!.map((attendance: Attendance, i) => (
          <TableRow key={attendance.student_id}>
            <TableCell className="w-[50px]">{i + 1}</TableCell>
            <TableCell className="w-[110px]">{attendance.nipd}</TableCell>
            <TableCell className="truncate max-w-[500px] font-medium">
              {attendance.fullname}
            </TableCell>
            <TableCell>
              <div className="relative w-max">
                <select
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-[200px] appearance-none bg-transparent font-normal"
                  )}
                >
                  <option value="h">Hadir</option>
                  <option value="i">Izin</option>
                  <option value="s">Sakit</option>
                  <option value="a">Alpa</option>
                  <option value="b">Bolos</option>
                </select>

                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </TableCell>
            <TableCell>
              <Input type="text" placeholder="Note" className="min-w-[150px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
