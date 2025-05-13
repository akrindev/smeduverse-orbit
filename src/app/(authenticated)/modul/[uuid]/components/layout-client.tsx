"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./sidebar-nax";
import { useModulQuery } from "@/queries/useModulQuery";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

export function LayoutClient({
  children,
  modulUuid,
}: {
  children: React.ReactNode;
  modulUuid: string;
}) {
  const { modulInfoQuery } = useModulQuery(modulUuid);

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

  const modul = modulInfoQuery.data;

  // If no data returned
  if (!modul) {
    return notFound();
  }

  const sidebarNavItems = [
    {
      title: "Presensi",
      href: `/modul/${modulUuid}`,
    },
    {
      title: "Penilaian",
      href: `/modul/${modulUuid}/penilaian`,
    },
    {
      title: "Informasi",
      href: `/modul/${modulUuid}/informasi`,
    },
  ];

  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="space-y-1 mt-5">
          <h2 className="font-semibold text-2xl tracking-tight">
            {modul.mapel.nama}
          </h2>
          <p className="text-muted-foreground text-sm">
            {/* list of all modul available */}
            {modul.teacher.fullname} - {modul.rombel.nama}
          </p>
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
