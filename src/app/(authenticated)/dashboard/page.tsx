import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ModulCard from "../components/ModulCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Halaman utama",
};

export default function Page() {
  const analitycs: Array<{
    name: string;
    value: number;
  }> = [
    {
      name: "Mata Pelajaran",
      value: 721,
    },
    {
      name: "Modul",
      value: 52,
    },
    {
      name: "Materi",
      value: 4573,
    },
    {
      name: "Presensi",
      value: 2234,
    },
  ];

  // yourModul dummy data has key owner, cover, class, name mapel, status
  // cover is image url from random unsplash image
  // status must be boolean
  // owner is teacher name in this example there was 3 teacher
  // mapel is matematika, fisika, kimia, biologi, bahasa indonesia, bahasa inggris, pkn, sejarah, geografi, ekonomi, sosiologi
  const yourModul: Array<{
    id: string;
    owner: string;
    cover: string;
    class: string;
    mapel: string;
    status: boolean;
  }> = [
    {
      id: Math.random().toString(36),
      owner: "Syakirin Amin",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Matematika",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Ahmad Syahrul",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Fisika",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Rizki Pratama",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Kimia",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Syakirin Amin",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Biologi",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Ahmad Syahrul",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Bahasa Indonesia",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Rizki Pratama",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Bahasa Inggris",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Syakirin Amin",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "PKN",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Ahmad Syahrul",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPA 2",
      mapel: "Sejarah",
      status: true,
    },
    {
      id: Math.random().toString(36),
      owner: "Rizki Pratama",
      cover: "https://picsum.photos/seed/picsum/500/500",
      class: "XII IPS 1",
      mapel: "Geografi",
      status: true,
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Selamat datang kembali
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analitycs.map((item) => (
            <Card
              key={item.name}
              className="shadow-md hover:scale-105 duration-500 cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.name}
                </CardTitle>
                {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                {/* <p className="text-xs text-muted-foreground">
                  jumlah keseluruhan mapel
                </p> */}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-5">
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Modul</h2>
            <p className="text-sm text-muted-foreground">
              Modul yang kamu kelola
            </p>
          </div>
          <Separator className="my-4" />
          <div className="relative">
            <ScrollArea>
              <div className="grid grid-cols-12 gap-5">
                {yourModul
                  .filter((m) => m.owner === "Syakirin Amin")
                  .map((modul) => (
                    <ModulCard
                      key={modul.mapel}
                      modul={modul as any}
                      className="cursor-pointer"
                    />
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
