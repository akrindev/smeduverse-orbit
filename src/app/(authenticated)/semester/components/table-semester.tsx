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
import { Semester } from "@/types/semester";
import { useEffect, useState } from "react";

export default function TableSemester() {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    const fetchSemesters = async () => {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/semester/list`
      );
      setSemesters(response.data);
    };

    fetchSemesters();
  }, []);

  return (
    <div className="border rounded-md">
      {/* show skeleton when semester is loading */}
      {semesters.length === 0 ? (
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
              <TableHead>Judul</TableHead>
              <TableHead>Status</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
