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
import { useUserQuery } from "@/store/useUser";
import { Teacher } from "@/types/modul";

export default function SelectTeacher({ onSelected }) {
  const { teachers, isLoading } = useUserQuery();

  if (isLoading) {
    return null;
  }

  return (
    <Select onValueChange={onSelected} defaultValue=''>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Pilih Guru' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Guru</SelectLabel>
          <ScrollArea className='h-72'>
            {/* <SelectItem value={""}>Semua Guru</SelectItem> */}
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
