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
  }, [refetch]);

  return (
    <div className="border rounded-md">
      {/* show skeleton when semester is loading */}
      {mapels.length === 0 ? (
        <div className="p-5 animate-pulse">
          <div className="space-y-1">
            <div className="bg-gray-300 rounded w-1/2 h-4"></div>
            <div className="bg-gray-300 rounded w-1/4 h-4"></div>
          </div>
          <div className="space-y-1 mt-5">
            <div className="bg-gray-300 rounded w-1/2 h-4"></div>
            <div className="bg-gray-300 rounded w-1/4 h-4"></div>
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
