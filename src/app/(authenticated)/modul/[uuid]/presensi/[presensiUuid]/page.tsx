"use client";

import { Separator } from "@/components/ui/separator";
import TablePresensi from "./components/table-presensi";
import { usePresence } from "@/store/usePresence";
import { useEffect } from "react";
import { Presence } from "@/types/presence";
import Information from "./components/information";

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

  useEffect(() => {
    showPresence(params.presensiUuid);
  }, []);

  return (
    <div>
      <Information
        key={presence.updated_at}
        modulUuid={params.uuid}
        presenceUuid={params.presensiUuid}
        title={presence?.title}
        description={presence?.description}
      />
      <Separator className="my-4" />
      <div className="rounded-md border">
        <TablePresensi attendances={presence?.attendances ?? []} />
      </div>
    </div>
  );
}
