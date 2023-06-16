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

export default function SelectRombel({ onSelected }) {
  const [rombels, refetch] = useRombel((state) => [
    state.rombels,
    state.refetch,
  ]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Select onValueChange={onSelected}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih Rombel" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Rombel</SelectLabel>
          <ScrollArea className="h-72">
            {rombels &&
              rombels.map((rombel: Rombel) => (
                <SelectItem key={rombel.id} value={rombel.id}>
                  {rombel.nama}
                </SelectItem>
              ))}
            <ScrollBar />
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
