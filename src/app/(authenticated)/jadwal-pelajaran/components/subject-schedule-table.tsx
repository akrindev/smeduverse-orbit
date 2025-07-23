"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  useSubjectSchedule,
  SubjectSchedule,
} from "@/store/useSubjectSchedule";
import ViewSwitcher from "@/components/ui/view-switcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SubjectScheduleTableProps {
  onEdit: (schedule: SubjectSchedule) => void;
}

export function SubjectScheduleTable({ onEdit }: SubjectScheduleTableProps) {
  const { schedules, loading, error, fetchSchedules, deleteSchedule } =
    useSubjectSchedule();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [view, setView] = useState<"table" | "grid">("table");

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleDelete = async (id: number, subjectKey: number) => {
    try {
      if (window.confirm("Apakah Anda yakin ingin menghapus jadwal ini?")) {
        setDeletingId(id);
        await deleteSchedule(id);
        toast({
          title: "Jadwal berhasil dihapus",
          description: `Jadwal untuk subject key ${subjectKey} telah dihapus.`,
        });
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus jadwal. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2">Memuat data jadwal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 border border-red-200 rounded-md text-red-800">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daftar Jadwal Pelajaran</CardTitle>
          <CardDescription>Daftar semua jadwal pelajaran yang terdaftar</CardDescription>
        </div>
        <ViewSwitcher onViewChange={setView} />
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <div className="py-8 text-center">Tidak ada data jadwal</div>
        ) : view === "table" ? (
          <ScheduleTable
            schedules={schedules}
            onEdit={onEdit}
            deletingId={deletingId}
            handleDelete={handleDelete}
          />
        ) : (
          <ScheduleGrid
            schedules={schedules}
            onEdit={onEdit}
            deletingId={deletingId}
            handleDelete={handleDelete}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ScheduleTable({
  schedules,
  onEdit,
  deletingId,
  handleDelete,
}: {
  schedules: SubjectSchedule[];
  onEdit: (schedule: SubjectSchedule) => void;
  deletingId: number | null;
  handleDelete: (id: number, subjectKey: number) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead>Subject Key</TableHead>
          <TableHead>Waktu Mulai</TableHead>
          <TableHead>Waktu Selesai</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedules.map((schedule, index) => (
          <TableRow key={schedule.id}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{schedule.subject_key}</TableCell>
            <TableCell>{schedule.start_time}</TableCell>
            <TableCell>{schedule.end_time}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(schedule)}
                  disabled={deletingId === schedule.id}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500"
                  onClick={() => handleDelete(schedule.id, schedule.subject_key)}
                  disabled={deletingId === schedule.id}
                >
                  {deletingId === schedule.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ScheduleGrid({
  schedules,
  onEdit,
  deletingId,
  handleDelete,
}: {
  schedules: SubjectSchedule[];
  onEdit: (schedule: SubjectSchedule) => void;
  deletingId: number | null;
  handleDelete: (id: number, subjectKey: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schedules.map((schedule) => (
        <Card key={schedule.id}>
          <CardHeader>
            <CardTitle>Subject Key: {schedule.subject_key}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              {schedule.start_time} - {schedule.end_time}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(schedule)}
                disabled={deletingId === schedule.id}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-red-500"
                onClick={() => handleDelete(schedule.id, schedule.subject_key)}
                disabled={deletingId === schedule.id}
              >
                {deletingId === schedule.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
