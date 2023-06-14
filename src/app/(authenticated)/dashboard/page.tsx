import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ModulCard from "../components/ModulCard";
import { Metadata } from "next";
import { Modul } from "@/types/modul";

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

  const yourModul: Modul[] = [
    {
      uuid: "e0c6e072-650c-4ba4-b550-14a4cc15802b",
      teacher_id: "00446645-ad22-4c8b-9b2b-ba0df6706ed2",
      rombongan_belajar_id: "0890666e-df8b-4a03-bd80-03db3cb48928",
      mapel_id: 1,
      semester_id: 3,
      status: 1,
      created_at: "2023-05-22T03:36:55.000000Z",
      updated_at: "2023-05-22T03:36:55.000000Z",
      deleted_at: null,
      teacher: {
        teacher_id: "00446645-ad22-4c8b-9b2b-ba0df6706ed2",
        fullname: "Rio aprianto",
        niy: "2022201",
      },
      rombel: {
        id: "0890666e-df8b-4a03-bd80-03db3cb48928",
        nama: "XII-2 TBSM",
        tingkat_kelas: 12,
        jurusan_id: 3,
        tahun_ajaran_id: 2,
        wali_id: "02fda90f-fec1-4b70-a2db-49ed0a4fd2e8",
        image: "/dist/images/saly-24.png",
        status_aktif: 1,
        created_at: "2022-08-02T05:31:20.000000Z",
        updated_at: "2022-08-02T05:31:20.000000Z",
        jurusan: {
          id: 3,
          nama: "Teknik dan Bisnis Sepeda Motor",
          kode: "TBSM",
          created_at: "2021-08-24T02:08:13.000000Z",
          updated_at: "2021-08-24T02:08:13.000000Z",
        },
        wali_kelas: {
          teacher_id: "02fda90f-fec1-4b70-a2db-49ed0a4fd2e8",
          fullname: "I INTRI ATI, S.Pd",
          niy: "2019206",
        },
      },
      mapel: {
        id: 1,
        kode: "MTK",
        nama: "Matematika",
        created_at: "2021-09-07T05:26:25.000000Z",
        updated_at: "2021-09-07T05:26:25.000000Z",
        deleted_at: null,
      },
      semester: {
        id: 3,
        name: "2022/2021-1",
        is_active: 1,
        date_start: null,
        date_end: null,
        created_at: "2023-05-22T01:45:51.000000Z",
        updated_at: "2023-05-22T01:45:51.000000Z",
      },
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
                  .filter((m) => m.teacher.fullname === "Rio aprianto")
                  .map((modul) => (
                    <ModulCard
                      key={modul.uuid}
                      modul={modul}
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
