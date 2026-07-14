"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nax";
import { useKelasAjarQuery } from "@/queries/useKelasAjarQuery";
import { ArrowLeft, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LayoutClient({
  children,
  modulUuid,
}: {
  children: React.ReactNode;
  modulUuid: string;
}) {
  const { kelasAjarInfoQuery } = useKelasAjarQuery(modulUuid);

  // Handle loading state
  if (kelasAjarInfoQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Handle error state
  if (kelasAjarInfoQuery.isError) {
    return notFound();
  }

  const kelasAjar = kelasAjarInfoQuery.data;

  // If no data returned
  if (!kelasAjar) {
    return notFound();
  }

  const sidebarNavItems = [
    {
      title: "Presensi",
      href: `/kelas-ajar/${modulUuid}`,
    },
    {
      title: "Penilaian",
      href: `/kelas-ajar/${modulUuid}/penilaian`,
    },
    {
      title: "Informasi",
      href: `/kelas-ajar/${modulUuid}/informasi`,
    },
  ];

  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mt-5">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">
              {kelasAjar.mapel.nama}
            </h2>
            <p className="text-muted-foreground text-sm">
              {/* list of all kelas ajar available */}
              {kelasAjar.teacher.fullname} - {kelasAjar.rombel.nama}
            </p>
          </div>
          <Link href={`/kelas-ajar/${modulUuid}`}>
            <Button variant="outline" className="flex items-center gap-2 w-fit">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Button>
          </Link>
        </div>
        <Separator className="my-4" />
        <div className="flex lg:flex-row flex-col lg:space-x-12 space-y-8 lg:space-y-0">
          <aside className="mx-4 lg:-mx-4 lg:w-1/6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
