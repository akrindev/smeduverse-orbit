"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectAttendanceStatus({
  onSelected,
  className,
}: {
  onSelected: (value: string) => void;
  className?: string;
}) {
  return (
    <Select
      defaultValue="no" // no meant 'tidak hadir' / except 'hadir'
      onValueChange={(value: string) => onSelected(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Status</SelectLabel>
          {/* no: tidak hadir, h: hadir, s: sakit, i: izin, a: alpa, b: bolos */}
          <SelectItem value="no">Tidak Hadir</SelectItem>
          <SelectItem value="h">Hadir</SelectItem>
          <SelectItem value="s">Sakit</SelectItem>
          <SelectItem value="i">Izin</SelectItem>
          <SelectItem value="a">Alpa</SelectItem>
          <SelectItem value="b">Bolos</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
