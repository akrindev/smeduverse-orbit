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
import {
  BaseSyntheticEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import debounce from "lodash.debounce";

export default function TablePresensi({
  attendances,
}: {
  attendances: Attendance[];
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
            <TableCell className="p-2 w-[40px] hidden md:flex items-center justify-center">
              {i + 1}
            </TableCell>
            <TableCell className="p-2 truncate max-w-[500px] font-medium">
              <span className="font-normal">{attendance.nipd}</span> -{" "}
              {attendance.fullname}
            </TableCell>
            <TableCell className="p-2">
              <StatusAction
                attendance={attendance}
                key={attendance.student_id + generateRandomString(15)}
              />
            </TableCell>
            <TableCell className="p-2">
              <NoteAction
                attendance={attendance}
                key={attendance.student_id + generateRandomString(15)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusAction({ attendance }: { attendance: Attendance }) {
  const [status, setStatus] = useState<string | "h" | "i" | "s" | "a" | "b">(
    attendance.presence.status
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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="relative w-max">
      <Select value={status} onValueChange={handleChange} disabled={loading}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status Kehadiran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="h">Hadir</SelectItem>
          <SelectItem value="i">Izin</SelectItem>
          <SelectItem value="s">Sakit</SelectItem>
          <SelectItem value="a">Alpa</SelectItem>
          <SelectItem value="b">Bolos</SelectItem>
        </SelectContent>
      </Select>

      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
    </div>
  );
}

function NoteAction({ attendance }: { attendance: Attendance }) {
  const [notes, setNotes] = useState<null | string>(attendance.presence.notes);
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
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (notes !== attendance.presence.notes) {
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
    />
  );
}
