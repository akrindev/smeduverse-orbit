"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Query, useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import ModulCard from "../../components/modul-card";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SelectTeacher from "../../components/form/select-teacher";
import SelectRombel from "../../components/form/select-rombel";
import SelectMapel from "../../components/form/select-mapel";
import BaseLoading from "@/components/base-loading";
import SelectSemester from "../../components/form/select-semester";

export default function ModulList({ owned }: { owned?: boolean }) {
  const [query, setQuery] = useState<Query | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWaka, setIsWaka] = useState(false);

  const [moduls, fetchOwned, refetch] = useModul<
    [
      Modul[] | Array<any> | null,
      (teacher_id: string | null | undefined) => Promise<void>,
      (query?: Query | null | undefined) => Promise<void>
    ]
  >((state) => [state.moduls, state.fetchOwned, state.refetch]);

  const { data: session } = useSession({
    required: true,
  });

  useEffect(() => {
    if (session) {
      const roles = session.user?.roles?.map((role) => role.name);

      // console.log(roles);

      if (roles?.includes("waka kurikulum")) {
        setIsWaka(true);
      }
    }
  }, [session]);

  useEffect(() => {
    setLoading(true);

    if (session) {
      if (owned) {
        fetchOwned(session.user?.id).finally(() => setLoading(false));
      } else {
        refetch(query).finally(() => setLoading(false));
      }
    }
  }, [query, session]);

  const isOwned = (modul: Modul) => {
    if (session) {
      return modul.teacher.teacher_id === session?.user?.id;
    }
    return false;
  };

  return (
    <div className='relative'>
      {!owned && (
        <div className='flex md:flex-row flex-col gap-3 my-3'>
          <SelectTeacher
            onSelected={(teacher_id) => setQuery({ ...query, teacher_id })}
          />
          <SelectRombel
            onSelected={(rombel_id) => setQuery({ ...query, rombel_id })}
          />
          <SelectMapel
            onSelected={(mapel_id) => setQuery({ ...query, mapel_id })}
          />
          <SelectSemester
            onSelected={(semester_id) => setQuery({ ...query, semester_id })}
          />
        </div>
      )}
      <ScrollArea>
        {loading ? (
          <BaseLoading />
        ) : (
          <div className='gap-5 grid grid-cols-12 py-5'>
            {moduls && moduls.length > 0 ? (
              moduls.map((modul: Modul) => (
                <ModulCard
                  key={modul.uuid}
                  modul={modul}
                  className='cursor-pointer'
                  isUser={isOwned(modul)}
                />
              ))
            ) : (
              <div className='col-span-full py-20 text-center'>
                Tidak ada modul yang tersedia pada semester ini. Silahkan buat
                modul baru untuk semester ini.
              </div>
            )}
          </div>
        )}
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </div>
  );
}
