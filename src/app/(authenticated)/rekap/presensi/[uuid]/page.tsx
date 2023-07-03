"use client";

import { Separator } from "@/components/ui/separator";
import { useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import { useEffect } from "react";
import TableAttendances from "./components/table-attendances";

interface RekapPageProps {
  params: {
    uuid: string;
  };
}

export default function RekapPage({ params }: RekapPageProps) {
  const [modul, fetchModul] = useModul<
    [modul: Modul | null, fetchByUuid: (uuid: string) => void]
  >((state) => [state.modul, state.fetchByUuid]);

  useEffect(() => {
    fetchModul(params.uuid);
  }, [params.uuid]);

  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mt-5 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {modul?.mapel.nama}
            </h2>
            <p className="text-sm text-muted-foreground">
              rekap presensi permodul
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        {/* table */}
        <TableAttendances modulUuid={params.uuid} />
        {/* end: table */}
      </div>
    </div>
  );
}
