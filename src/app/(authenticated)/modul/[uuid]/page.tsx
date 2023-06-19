"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function ModulPage({ params }: { params: { uuid: string } }) {
  const router = useRouter();

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
