import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { Modul } from "@/types/modul";
import { AxiosPromise, AxiosResponse } from "axios";
import { notFound } from "next/navigation";
import { SidebarNav } from "./components/sidebar-nax";

export async function getModulInfo(uuid: string) {
  const response = await api.get(`/modul/show/${uuid}`);

  return response;
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    uuid: string;
  };
}) {
  const { data: modul, status } = await getModulInfo(params.uuid);

  if (status === 404) {
    notFound();
  }

  const sidebarNavItems = [
    {
      title: "Presensi",
      href: `/modul/${params.uuid}`,
    },
    {
      title: "Penilaian",
      href: `/modul/${params.uuid}/penilaian`,
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="mt-5 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {modul.mapel.nama}
          </h2>
          <p className="text-sm text-muted-foreground">
            {/* list of all modul available */}
            {modul.teacher.fullname} - {modul.rombel.nama}
          </p>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-4 lg:-mx-4 lg:w-1/6">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
