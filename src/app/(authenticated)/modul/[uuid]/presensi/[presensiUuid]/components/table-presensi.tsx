"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { usePresence } from "@/store/usePresence";
import { Attendance } from "@/types/attendance";
import { ChevronDown } from "lucide-react";
import { BaseSyntheticEvent, useEffect, useRef, useState } from "react";

export default function TablePresensi({
  attendances,
  onUpdate,
}: {
  attendances: Attendance[];
  onUpdate?: () => void;
}) {
  const generateRandomString = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden md:flex"></TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances!.map((attendance: Attendance, i) => (
          <TableRow key={attendance.student_id + generateRandomString(15)}>
            <TableCell className="hidden md:flex justify-center items-center p-2 w-[40px]">
              {i + 1}
            </TableCell>
            <TableCell className="p-2 max-w-[500px] font-normal md:font-medium truncate">
              <span className="font-normal text-gray-300 dark:text-gray-700">
                {attendance.nipd}
              </span>{" "}
              <br />
              {attendance.fullname}
            </TableCell>
            <TableCell className="p-2">
              <StatusAction
                attendance={attendance}
                key={attendance.student_id + generateRandomString(15)}
                onUpdate={onUpdate}
              />
            </TableCell>
            <TableCell className="p-2">
              <NoteAction
                attendance={attendance}
                key={attendance.student_id + generateRandomString(15)}
                onUpdate={onUpdate}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusAction({
  attendance,
  onUpdate,
}: {
  attendance: Attendance;
  onUpdate?: () => void;
}) {
  const [status, setStatus] = useState<string | "h" | "i" | "s" | "a" | "b">(
    attendance.presence!.status
  );
  const [loading, setLoading] = useState(false);

  const updateAttendance = usePresence((state) => state.updateAttendance);

  function handleChange(status: string) {
    setStatus(status);

    setLoading(true);

    updateAttendance({ attendance, status })
      .then((res) => {
        if (res.status === 200) {
          // @ts-ignore
          setStatus(res.data.in_status);
          toast({
            title: "Berhasil",
            description: "Status kehadiran berhasil diubah",
          });

          // Call onUpdate after successful status change
          if (onUpdate) {
            onUpdate();
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "h":
        return "text-green-600 dark:text-green-500 font-medium";
      case "i":
        return "text-amber-600 dark:text-amber-500 font-medium";
      case "s":
        return "text-blue-600 dark:text-blue-500 font-medium";
      case "a":
        return "text-red-600 dark:text-red-500 font-medium";
      case "b":
        return "text-rose-600 dark:text-rose-500 font-medium";
      default:
        return "";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "h":
        return "Hadir";
      case "i":
        return "Izin";
      case "s":
        return "Sakit";
      case "a":
        return "Alpa";
      case "b":
        return "Bolos";
      default:
        return "Status Kehadiran";
    }
  };

  return (
    <div className="relative w-max">
      <Select value={status} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className={`w-[150px] ${getStatusColor(status)}`}>
          <SelectValue placeholder="Status Kehadiran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            value="h"
            className="font-medium text-green-600 dark:text-green-500"
          >
            Hadir
          </SelectItem>
          <SelectItem
            value="i"
            className="font-medium text-amber-600 dark:text-amber-500"
          >
            Izin
          </SelectItem>
          <SelectItem
            value="s"
            className="font-medium text-blue-600 dark:text-blue-500"
          >
            Sakit
          </SelectItem>
          <SelectItem
            value="a"
            className="font-medium text-red-600 dark:text-red-500"
          >
            Alpa
          </SelectItem>
          <SelectItem
            value="b"
            className="font-medium text-rose-600 dark:text-rose-500"
          >
            Bolos
          </SelectItem>
        </SelectContent>
      </Select>

      {/* <ChevronDown className='top-3 right-3 absolute opacity-50 w-4 h-4' /> */}
    </div>
  );
}

function NoteAction({
  attendance,
  onUpdate,
}: {
  attendance: Attendance;
  onUpdate?: () => void;
}) {
  const [notes, setNotes] = useState<null | string>(attendance.presence!.notes);
  const [debouncedValue, setDebouncedValue] = useState<string | null>(null);

  // input ref
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const updateAttendanceNotes = usePresence(
    (state) => state.updateAttendanceNotes
  );

  function handleChange() {
    const notes = debouncedValue;
    setLoading(true);

    updateAttendanceNotes({ attendance, notes })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Berhasil",
            description: "Catatan kehadiran berhasil diubah",
          });

          // Call onUpdate after successful notes change
          if (onUpdate) {
            onUpdate();
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (notes !== attendance.presence!.notes) {
        setDebouncedValue(notes);
        // focus the input
        inputRef.current?.focus();
      }
    }, 2500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [notes]);

  useEffect(() => {
    if (debouncedValue) {
      handleChange();
    }
  }, [debouncedValue]);

  return (
    // the input should have a value of notes
    // and it should call doWriteNotes on change
    <Input
      ref={inputRef}
      value={notes || ""}
      onChange={(e: BaseSyntheticEvent) => setNotes(e.target.value)}
      placeholder="Catatan Kehadiran"
      disabled={loading}
      className="min-w-[150px]"
    />
  );
}
