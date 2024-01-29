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
import { useSemester } from "@/store/useSemester";
import { useEffect } from "react";

export default function SelectSemester({ onSelected }) {
  const [semesters, refetch] = useSemester((state) => [
    state.semesters,
    state.refetch,
  ]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Select onValueChange={(value: string) => onSelected(value)}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Pilih Semester' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel>Pilih Semester</SelectLabel> */}
          <ScrollArea className='h-72'>
            {/* <SelectItem value={""}>Semua Semester</SelectItem> */}
            {semesters &&
              semesters.map((semester) => (
                <SelectItem key={semester.name} value={semester.id.toString()}>
                  {semester.name}
                </SelectItem>
              ))}
            <ScrollBar />
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
