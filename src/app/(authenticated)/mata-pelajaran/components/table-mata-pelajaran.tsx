"use client";

import { useState } from "react";
import { Mapel } from "@/types/modul";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import ViewSwitcher from "@/components/ui/view-switcher";
import DialogMataPelajaran from "./dialog-mata-pelajaran";

interface TableMataPelajaranProps {
  data: Mapel[];
}

export default function TableMataPelajaran({ data }: TableMataPelajaranProps) {
  const [view, setView] = useState<"table" | "grid">("table");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daftar Mata Pelajaran</CardTitle>
          <CardDescription>Daftar semua mata pelajaran yang terdaftar</CardDescription>
        </div>
        <ViewSwitcher onViewChange={setView} />
      </CardHeader>
      <CardContent>
        {view === "table" ? (
          <MataPelajaranTable data={data} />
        ) : (
          <MataPelajaranGrid data={data} />
        )}
      </CardContent>
    </Card>
  );
}

function MataPelajaranTable({ data }: { data: Mapel[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kode</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((mapel: Mapel) => (
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
  );
}

function MataPelajaranGrid({ data }: { data: Mapel[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((mapel) => (
        <Card key={mapel.id}>
          <CardHeader>
            <CardTitle>{mapel.nama}</CardTitle>
            <CardDescription>{mapel.kode}</CardDescription>
          </CardHeader>
          <CardContent>
            <DialogMataPelajaran mapel={mapel} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
