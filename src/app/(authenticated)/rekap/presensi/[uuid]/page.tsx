"use client";

import { Separator } from "@/components/ui/separator";
import { useModul } from "@/store/useModul";
import { Modul } from "@/types/modul";
import { useEffect, useState } from "react";
import TableAttendances from "./components/table-attendances";
import { Button } from "@/components/ui/button";
import { IconDownload, IconLink } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TablePresences from "./components/table-presence";
import { AxiosPromise, AxiosResponse } from "axios";
import { isUser } from "@/lib/auth-role";
import { useAuth } from "@/store/useAuth";
import BaseLoading from "@/components/base-loading";
import { api } from "@/lib/api";
import { ArrowLeft, Loader } from "lucide-react";
import Link from "next/link";

interface RekapPageProps {
  params: {
    uuid: string;
  };
}

export default function RekapPage({ params }: RekapPageProps) {
  const [loading, setLoading] = useState(false);
  const [modul, fetchModul] = useModul<
    [
      modul: Modul | null,
      fetchByUuid: (uuid: string) => AxiosPromise<AxiosResponse>
    ]
  >((state) => [state.modul, state.fetchByUuid]);

  const router = useRouter();

  // Use the custom auth store instead of next-auth
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    fetchModul(params.uuid).catch((e) => {
      router.push("/modul");
    });
  }, [params.uuid]);

  if (!user || isLoading) {
    return <BaseLoading />;
  }

  // handle cetak
  const handleExport = async () => {
    setLoading(true);
    // download data using axios api
    const response = await api
      .get(`/modul/presence/recap/export/${params.uuid}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `rekap presensi ${modul?.mapel.kode}-${modul?.rombel.nama}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="space-y-1 mt-5">
            <h2 className="font-semibold text-2xl tracking-tight">
              Rekap Presensi
            </h2>
            <p className="text-muted-foreground text-sm">
              Rekap presensi pada modul {modul?.mapel.nama} <br />
              {modul?.rombel.nama} - {modul?.teacher.fullname}
            </p>
          </div>
          <div className="flex gap-3 mt-5 md:mt-0">
            <Button variant="outline" onClick={handleExport} disabled={loading}>
              {loading ? (
                <Loader className="w-5 h-5" />
              ) : (
                <div className="flex items-center gap-2">
                  Unduh
                  <IconDownload className="w-4 h-4" />
                </div>
              )}
            </Button>
            <div className="flex mb-2">
              <Link href={`/modul/${params.uuid}`}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
            </div>
            {/* {isUser(user, modul?.teacher_id!) && (
              <Link href={`/modul/${params.uuid}`}>
                <Button variant='default'>
                  Lihat
                  <IconLink className='ml-1 w-4 h-4' />
                </Button>
              </Link>
            )} */}
          </div>
        </div>
        <Separator className="my-4" />
        {/* table */}
        <Tabs defaultValue="rekap">
          <TabsList className="grid grid-cols-2 max-w-md">
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
