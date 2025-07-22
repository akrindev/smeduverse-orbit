"use client";

import { useState } from "react";
import { Semester } from "@/types/semester";
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
import DialogSemester from "./dialog-semester";

interface TableSemesterProps {
  data: Semester[];
}

export default function TableSemester({ data }: TableSemesterProps) {
  const [view, setView] = useState<"table" | "grid">("table");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daftar Semester</CardTitle>
          <CardDescription>Daftar semua semester yang terdaftar</CardDescription>
        </div>
        <ViewSwitcher onViewChange={setView} />
      </CardHeader>
      <CardContent>
        {view === "table" ? (
          <SemesterTable data={data} />
        ) : (
          <SemesterGrid data={data} />
        )}
      </CardContent>
    </Card>
  );
}

function SemesterTable({ data }: { data: Semester[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((semester: Semester) => (
          <TableRow key={semester.id}>
            <TableCell>{semester.name}</TableCell>
            <TableCell>
              {semester.is_active ? (
                <span className="text-green-500">Aktif</span>
              ) : (
                <span className="text-red-500">Tidak Aktif</span>
              )}
            </TableCell>
            <TableCell>
              {semester.is_active === 1 && (
                <DialogSemester semester={semester} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function SemesterGrid({ data }: { data: Semester[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((semester) => (
        <Card key={semester.id}>
          <CardHeader>
            <CardTitle>{semester.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{semester.is_active ? "Aktif" : "Tidak Aktif"}</p>
            {semester.is_active === 1 && (
              <DialogSemester semester={semester} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
