"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMapel } from "@/store/useMapel";
import { Mapel } from "@/types/modul";
import { useEffect } from "react";
import DialogMataPelajaran from "./dialog-mata-pelajaran";

// it will be used in mata-pelajaran.tsx

export default function TableMataPelajaran() {
  const [mapels, refetch] = useMapel((state) => [state.mapels, state.refetch]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="border rounded-md">
      {/* show skeleton when semester is loading */}
      {mapels.length === 0 ? (
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mapels.map((mapel: Mapel) => (
              <TableRow key={mapel.id}>
                <TableCell className="max-w-[20px]">
                  <div className="font-medium">{mapel.kode}</div>
                </TableCell>
                <TableCell>{mapel.nama}</TableCell>
                <TableCell>
                  <DialogMataPelajaran mapel={mapel} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
