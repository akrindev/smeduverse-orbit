"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import ModulCard from "../../components/modul-card";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ModulList({ owned }: { owned?: boolean }) {
  const [moduls, fetchOwned, refetch] = useModul((state) => [
    state.moduls,
    state.fetchOwned,
    state.refetch,
  ]);

  const { data: session } = useSession({
    required: true,
  });

  useEffect(() => {
    if (session) {
      if (owned) {
        fetchOwned(session.user?.id);
      } else {
        refetch();
      }
    }
  }, []);

  const isOwned = (modul: Modul) => {
    if (session) {
      return modul.teacher.teacher_id === session?.user?.id;
    }
    return false;
  };

  return (
    <div className="relative">
      <ScrollArea>
        <div className="py-5 grid grid-cols-12 gap-5">
          {moduls &&
            moduls.map((modul: Modul) => (
              <ModulCard
                key={modul.uuid}
                modul={modul}
                className="cursor-pointer"
                isUser={isOwned(modul)}
              />
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
