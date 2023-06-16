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
import { useRombel } from "@/store/useRombel";
import { Rombel } from "@/types/modul";
import { useEffect } from "react";

export default function SelectRombel() {
  const [rombels, refetch] = useRombel((state) => [
    state.rombels,
    state.refetch,
  ]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    console.log(rombels);
  }, [rombels]);

  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih Rombel" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Rombel</SelectLabel>
          <ScrollArea className="h-72">
            {rombels &&
              rombels.map((rombel: Rombel) => (
                <SelectItem value={rombel.id}>{rombel.nama}</SelectItem>
              ))}
            <ScrollBar />
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
