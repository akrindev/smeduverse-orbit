"use client";

import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import DialogMataPelajaran from "./components/dialog-mata-pelajaran";
import TableMataPelajaran from "./components/table-mata-pelajaran";
import { useRoleCheck } from "@/lib/auth-role";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function MataPelajaranPage() {
  const { isWakaKurikulum } = useRoleCheck();

  // Check if user is waka kurikulum, if not redirect to dashboard
  useEffect(() => {
    if (!isWakaKurikulum()) {
      redirect("/dashboard");
    }
  }, [isWakaKurikulum]);

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
          {/* dialog */}
          <DialogMataPelajaran />
        </div>
        <Separator className="my-4" />
        <Alert>
          <IconInfoCircle className="mr-2 w-5 h-5" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Kelola data mata pelajaran.</AlertDescription>
        </Alert>
        <div className="my-4"></div>
        {/* table */}
        <TableMataPelajaran />
      </div>
    </div>
  );
}
