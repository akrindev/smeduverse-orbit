"use client";

import { Separator } from "@/components/ui/separator";
import TablePresensi from "./components/table-presensi";
import { usePresence } from "@/store/usePresence";
import { useCallback, useEffect, useState } from "react";
import { Presence } from "@/types/presence";
import Information from "./components/information";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AxiosPromise, AxiosResponse } from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";
import { useModulQuery } from "@/queries/useModulQuery";

interface PresensiPageProps {
  params: {
    uuid: string;
    presensiUuid: string;
  };
}

export default function PreseniPage({ params }: PresensiPageProps) {
  const [loading, setLoading] = useState(false);
  const [presence, showPresence] = usePresence<
    [Presence, (uuid: string) => AxiosPromise<AxiosResponse>]
  >((state) => [state.presence, state.showPresence]);

  const updatingPresence = useCallback(() => {
    setLoading(true);
    return showPresence(params.presensiUuid).finally(() => setLoading(false));
  }, [params.presensiUuid]);

  const router = useRouter();
  const { user } = useAuth();
  const { modulInfoQuery } = useModulQuery(params.uuid);

  useEffect(() => {
    updatingPresence().catch((res) => {
      if (res.response.status === 404) {
        toast({
          title: "Presensi tidak ditemukan",
          description: "Presensi yang anda cari tidak ditemukan",
        });

        router.push(`/modul/${params.uuid}`);
      }
    });
  }, []);

  // Redirect if current user is not the owner (teacher) of the module
  useEffect(() => {
    if (
      modulInfoQuery?.data &&
      user &&
      modulInfoQuery.data.teacher.teacher_id !== user.id
    ) {
      router.push(`/rekap/presensi/${params.uuid}`);
    }
  }, [modulInfoQuery?.data, user, params.uuid, router]);

  return (
    <div>
      <Information
        key={presence.updated_at}
        modulUuid={params.uuid}
        presenceUuid={params.presensiUuid}
        title={presence?.title}
        description={presence?.description}
        date={presence?.date}
        presence={presence}
        onRefresh={updatingPresence}
        isLoading={loading}
      />
      {/* <Separator className="my-4" /> */}
      <div className="relative mt-5 border rounded-md w-full">
        <ScrollArea>
          <TablePresensi
            attendances={presence?.attendances ?? []}
            onUpdate={updatingPresence}
          />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
