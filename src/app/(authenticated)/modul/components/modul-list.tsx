"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import ModulCard from "../../components/ModulCard";
import { useEffect } from "react";

export default function ModulList() {
  const [moduls, refetch] = useModul((state) => [state.moduls, state.refetch]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="relative">
      <ScrollArea>
        <div className="grid grid-cols-12 gap-5">
          {moduls &&
            moduls.map((modul: Modul) => (
              <ModulCard
                key={modul.uuid}
                modul={modul}
                className="cursor-pointer"
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
