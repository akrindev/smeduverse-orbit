"use client";

import { Separator } from "@/components/ui/separator";
import TableListPresensi from "./table-list-presensi";
import DialogPresensi from "./dialog-presensi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useModulQuery } from "@/queries/useModulQuery";
import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";

export default function ModulClient({ modulUuid }: { modulUuid: string }) {
  const router = useRouter();
  const { modulInfoQuery } = useModulQuery(modulUuid);
  const { user } = useAuth();

  // Handle loading state
  if (modulInfoQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (modulInfoQuery.isError) {
    return notFound();
  }

  const data = modulInfoQuery.data;

  // Check if module belongs to user
  useEffect(() => {
    // If module doesn't belong to user, redirect
    if (data && user && data.teacher.teacher_id !== user.id) {
      router.push(`/rekap/presensi/${modulUuid}`);
    }
  }, [data, user, modulUuid, router]);

  // If no data returned
  if (!data) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="gap-3 grid grid-cols-12">
        <div className="col-span-12 md:col-span-6">
          <h3 className="font-medium text-lg">Presensi</h3>
          <p className="text-muted-foreground text-sm">
            Daftar presensi yang telah dibuat
          </p>
        </div>
        <div className="flex justify-end items-center gap-3 col-span-12 md:col-span-6">
          <DialogPresensi modulUuid={modulUuid} />
          <Link href={`/rekap/presensi/${modulUuid}`}>
            <Button variant={`outline`}>
              <FileText className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <Separator />
      <TableListPresensi modulUuid={modulUuid} />
    </div>
  );
}
