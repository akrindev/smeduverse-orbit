"use client";

import { Separator } from "@/components/ui/separator";
import TableSemester from "./components/table-semester";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import DialogCreateSemester from "./components/dialog-semester";
import { useRoleCheck } from "@/lib/auth-role";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function SemesterPage() {
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
            <h2 className="font-semibold text-2xl tracking-tight">Semester</h2>
            <p className="text-muted-foreground text-sm">
              Kelola data semester
            </p>
          </div>
          <DialogCreateSemester />
        </div>
        <Separator className="my-4" />
        <Alert>
          <IconInfoCircle className="mr-2 w-5 h-5" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            Jika Anda menambahkan semester baru, maka semester yang baru
            ditambahkan akan menjadi semester aktif dan semester sebelumnya akan
            menjadi tidak aktif. Anda dapat mengubah semester aktif jika
            terdapat kesalahan saat prosesi input semester. Jika Anda menghapus
            semester aktif, maka semester yang sebelumnya akan diganti menjadi
            semester aktif saat ini.
          </AlertDescription>
        </Alert>
        <div className="my-4"></div>
        {/* table of semester that has title and status */}
        <TableSemester />
      </div>
    </div>
  );
}
