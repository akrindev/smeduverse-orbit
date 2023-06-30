"use client";

import { Separator } from "@/components/ui/separator";
import { useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import { useEffect } from "react";

interface InformationProps {
  params: {
    uuid: string;
  };
}

export default async function PreseniPage({ params }: InformationProps) {
  const [modul, fetchByUuid] = useModul<
    [Modul | null, (uuid: string) => Promise<void>]
  >((state) => [state.modul, state.fetchByUuid]);

  useEffect(() => {
    fetchByUuid(params.uuid);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6">
          <h3 className="text-lg font-medium">Informasi</h3>
          <p className="text-sm text-muted-foreground">Informasi modul</p>
        </div>
      </div>
      <Separator />
      {modul && (
        <div className="grid grid-cols-12 gap-3 md:gap-6">
          <div className="col-span-12">
            <h3 className="text-md font-medium">Judul Modul</h3>
            <p className="text-sm text-muted-foreground">{modul.mapel.nama}</p>
          </div>

          <div className="col-span-12">
            <h3 className="text-md font-medium">Guru Pengajar</h3>
            <p className="text-sm text-muted-foreground">
              {modul.teacher.fullname}
            </p>
          </div>

          <div className="col-span-12">
            <h3 className="text-md font-medium">Kelas</h3>
            <p className="text-sm text-muted-foreground">{modul.rombel.nama}</p>
          </div>

          <div className="col-span-12">
            <h3 className="text-md font-medium">Semester</h3>
            <p className="text-sm text-muted-foreground">
              {modul.semester.name}
            </p>
          </div>

          <div className="col-span-12">
            <h3 className="text-md font-medium">Status</h3>
            <p className="text-sm text-muted-foreground">
              {modul.status ? "Aktif" : "Tidak Aktif"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
