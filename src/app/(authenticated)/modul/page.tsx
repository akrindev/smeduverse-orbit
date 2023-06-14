import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import ModulCard from "../components/ModulCard";
import { Metadata } from "next";
import { Modul } from "@/types/modul";

export const metadata: Metadata = {
  title: "Modul",
  description: "Daftar semua modul yang telah dibuat",
};

export default async function Page() {
  // make dummy data for modul
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
        <div className="mt-5 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Modul</h2>
          <p className="text-sm text-muted-foreground">
            {/* list of all modul available */}
            Daftar semua modul yang telah dibuat
          </p>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="grid grid-cols-12 gap-5">
              {yourModul.map((modul) => (
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
  );
}
