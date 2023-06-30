"use client";

import { Separator } from "@/components/ui/separator";
import TablePresensi from "./components/table-presensi";
import { usePresence } from "@/store/usePresence";
import { useCallback, useEffect } from "react";
import { Presence } from "@/types/presence";
import Information from "./components/information";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PresensiPageProps {
  params: {
    uuid: string;
    presensiUuid: string;
  };
}

export default async function PreseniPage({ params }: PresensiPageProps) {
  const [presence, showPresence] = usePresence<
    [Presence, (uuid: string) => Promise<void>]
  >((state) => [state.presence, state.showPresence]);

  const updatingPresence = useCallback(
    () => showPresence(params.presensiUuid),
    [params.presensiUuid]
  );

  useEffect(() => {
    updatingPresence();
  }, []);

  return (
    <div>
      <Information
        key={presence.updated_at}
        modulUuid={params.uuid}
        presenceUuid={params.presensiUuid}
        title={presence?.title}
        description={presence?.description}
        presence={presence}
        onRefresh={updatingPresence}
      />
      {/* <Separator className="my-4" /> */}
      <div className="relative w-full mt-5 rounded-md border">
        <ScrollArea>
          <TablePresensi attendances={presence?.attendances ?? []} />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
