"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";
import { useSemester } from "@/store/useSemester";
import { Semester } from "@/types/semester";
import { useEffect, useState } from "react";
import DialogSemester from "./dialog-semester";

export default function TableSemester() {
  const [loading, setLoading] = useState<boolean>(false);
  const [semesters, setSemesters] = useSemester((state) => [
    state.semesters,
    state.setSemesters,
  ]);

  useEffect(() => {
    setLoading(true);
    const fetchSemesters = async () => {
      const response = await api
        .get(`${process.env.NEXT_PUBLIC_API_URL}/semester/list`)
        .finally(() => setLoading(false));

      setSemesters(response.data);
    };

    fetchSemesters();
  }, []);

  return (
    <div className="border rounded-md">
      {/* show skeleton when semester is loading */}
      {loading ? (
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
      ) : semesters && semesters.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters.map((semester: Semester) => (
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
      ) : (
        <div className="p-5">
          Belum ada Data semester, silahkan tambahkan semester baru
        </div>
      )}
    </div>
  );
}
