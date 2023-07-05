"use client";

import { Separator } from "@/components/ui/separator";
import { useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import { useEffect } from "react";
import TableAttendances from "./components/table-attendances";
import { Button } from "@/components/ui/button";
import { IconLink } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TablePresences from "./components/table-presence";

interface RekapPageProps {
  params: {
    uuid: string;
  };
}

export default function RekapPage({ params }: RekapPageProps) {
  const [modul, fetchModul] = useModul<
    [modul: Modul | null, fetchByUuid: (uuid: string) => void]
  >((state) => [state.modul, state.fetchByUuid]);

  const router = useRouter();

  useEffect(() => {
    fetchModul(params.uuid);
  }, [params.uuid]);

  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mt-5 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Rekap Presensi
            </h2>
            <p className="text-sm text-muted-foreground">
              Rekap presensi pada modul {modul?.mapel.nama} -{" "}
              {modul?.rombel.nama} - {modul?.teacher.fullname}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Cetak</Button>
            <Button
              variant="default"
              onClick={() => router.push(`/modul/${params.uuid}`)}
            >
              Lihat
              <IconLink className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        {/* table */}
        <Tabs defaultValue="rekap">
          <TabsList className="max-w-md grid grid-cols-2">
            <TabsTrigger value="rekap">Kehadiran</TabsTrigger>
            <TabsTrigger value="presensi">Presensi</TabsTrigger>
          </TabsList>
          <TabsContent value="rekap">
            <TableAttendances modulUuid={params.uuid} />
          </TabsContent>
          <TabsContent value="presensi">
            <TablePresences modulUuid={params.uuid} />
          </TabsContent>
        </Tabs>
        {/* end: table */}
      </div>
    </div>
  );
}
