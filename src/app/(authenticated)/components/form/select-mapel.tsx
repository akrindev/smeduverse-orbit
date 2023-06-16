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
import { useMapel } from "@/store/useMapel";
import { useRombel } from "@/store/useRombel";
import { Mapel, Rombel } from "@/types/modul";
import { useEffect } from "react";

export default function SelectMapel() {
  const [mapels, refetch] = useMapel((state) => [state.mapels, state.refetch]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    console.log(mapels);
  }, [mapels]);

  return (
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pilih Mapel" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Pilih Mapel</SelectLabel>
          <ScrollArea className="h-72">
            {mapels &&
              mapels.map((mapel: Mapel) => (
                <SelectItem value={mapel.id as string}>
                  {mapel.kode} - {mapel.nama}
                </SelectItem>
              ))}
            <ScrollBar />
          </ScrollArea>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
