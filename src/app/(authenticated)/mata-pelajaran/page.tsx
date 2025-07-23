"use client";

import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import DialogMataPelajaran from "./components/dialog-mata-pelajaran";
import TableMataPelajaran from "./components/table-mata-pelajaran";
import { useRoleCheck } from "@/lib/auth-role";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useMapel } from "@/store/useMapel";

export default function MataPelajaranPage() {
  const { isWakaKurikulum } = useRoleCheck();
  const [mapels, refetch] = useMapel((state) => [state.mapels, state.refetch]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isWakaKurikulum()) {
      redirect("/dashboard");
    }
  }, [isWakaKurikulum]);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="space-y-1 mt-5">
            <h2 className="font-semibold text-2xl tracking-tight">
              Mata Pelajaran
            </h2>
            <p className="text-muted-foreground text-sm">
              Kelola data Mata Pelajaran
            </p>
          </div>
          <DialogMataPelajaran />
        </div>
        <Separator className="my-4" />
        <Alert>
          <IconInfoCircle className="mr-2 w-5 h-5" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Kelola data mata pelajaran.</AlertDescription>
        </Alert>
        <div className="my-4"></div>
        {loading ? (
          <div className="p-5 animate-pulse">
            <div className="space-y-1">
              <div className="bg-gray-300 rounded w-1/2 h-4"></div>
              <div className="bg-gray-300 rounded w-1/4 h-4"></div>
            </div>
            <div className="space-y-1 mt-5">
              <div className="bg-gray-300 rounded w-1/2 h-4"></div>
              <div className="bg-gray-300 rounded w-1/4 h-4"></div>
            </div>
          </div>
        ) : (
          <TableMataPelajaran data={mapels} />
        )}
      </div>
    </div>
  );
}
