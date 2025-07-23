"use client";

import { Separator } from "@/components/ui/separator";
import TableSemester from "./components/table-semester";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import DialogCreateSemester from "./components/dialog-semester";
import { useRoleCheck } from "@/lib/auth-role";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSemester } from "@/store/useSemester";
import { Semester } from "@/types/semester";

export default function SemesterPage() {
  const { isWakaKurikulum } = useRoleCheck();
  const [loading, setLoading] = useState<boolean>(false);
  const [semesters, setSemesters] = useSemester((state) => [
    state.semesters,
    state.setSemesters,
  ]);

  useEffect(() => {
    if (!isWakaKurikulum()) {
      redirect("/dashboard");
    }
  }, [isWakaKurikulum]);

  useEffect(() => {
    setLoading(true);
    const fetchSemesters = async () => {
      try {
        const response = await api.get(
          `${process.env.NEXT_PUBLIC_API_URL}/semester/list`
        );
        setSemesters(response.data);
      } catch (error) {
        console.error("Failed to fetch semesters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, [setSemesters]);

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
        {loading ? (
          <div className="animate-pulse p-5">
            <div className="space-y-1">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="mt-5 space-y-1">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ) : (
          <TableSemester data={semesters} />
        )}
      </div>
    </div>
  );
}
