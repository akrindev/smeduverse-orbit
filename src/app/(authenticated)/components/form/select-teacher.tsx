"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/store/useUser";
import { Teacher } from "@/types/modul";
import { useEffect } from "react";

export default function SelectTeacher({ onSelected }) {
  const [teachers, refetch] = useUser((state) => [
    state.teachers,
    state.refetch,
  ]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Select onValueChange={onSelected}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih Guru" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Guru</SelectLabel>
          <ScrollArea className="h-72">
            {teachers &&
              teachers.map((teacher: Teacher) => (
                <SelectItem key={teacher.teacher_id} value={teacher.teacher_id}>
                  {teacher.fullname} ({teacher.niy})
                </SelectItem>
              ))}
            <ScrollBar />
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
