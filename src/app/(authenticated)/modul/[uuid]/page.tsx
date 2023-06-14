"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modul } from "@/types/modul";
import { useRouter } from "next/navigation";
import { Router } from "next/router";

export default function ModulPage({ params }: { params: { uuid: string } }) {
  const router = useRouter();
  const modul: Modul = {
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
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="max-w-[130px] truncate font-medium">
              Presensi ke 1 dan 2 dan 3 dan 4
            </TableCell>
            <TableCell className="max-w-[500px] truncate">
              {/* desctiption */}
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Non minus
              natus, explicabo id voluptates laboriosam aliquam! Harum dolor hic
              sit? Inventore veniam ratione ullam perferendis sunt tempora
              aperiam assumenda culpa?
            </TableCell>
            <TableCell>
              {/* date */}
              Jumat, 12 Mei 2023
            </TableCell>
            <TableCell>
              {/* date */}
              <Button
                onClick={() =>
                  router.push(`/modul/${params.uuid}/presensi/122-333`)
                }
                variant={`ghost`}
                className="border border-grey"
              >
                lihat
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
