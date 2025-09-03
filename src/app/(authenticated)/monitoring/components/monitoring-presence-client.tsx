"use client";

import { RombelWithPresence, AttendanceRecord, PresenceStatus, ActivePresence } from "@/types/monitor";
import { useMonitorPresenceQuery } from "@/queries/useMonitorPresenceQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CalendarClock, User, BookOpen } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function MonitoringPresenceClient() {
  // Gunakan query hook untuk mengambil presensi aktif dengan refresh 10 detik
  const { activePresencesQuery } = useMonitorPresenceQuery(10000);
  const { data, isLoading, error } = activePresencesQuery;

  // Kelompokkan rombel berdasarkan tingkat kelas
  const groupedRombels =
    data?.rombel.reduce((acc, rombel) => {
      const grade = rombel.tingkat_kelas;
      if (!acc[grade]) acc[grade] = [];
      acc[grade].push(rombel);
      return acc;
    }, {} as Record<number, RombelWithPresence[]>) || {};

  // Urutkan tingkat kelas
  const sortedGrades = Object.keys(groupedRombels)
    .map(Number)
    .sort((a, b) => a - b);

  if (isLoading) {
    return <div className="py-8 text-center">Memuat data pemantauan...</div>;
  }

  if (error) {
    return (
      <div className="py-8 text-red-500 text-center">
        Gagal memuat data pemantauan
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header dengan waktu saat ini dan statistik */}
      <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-medium">
            Waktu Saat Ini: {data?.current_time}
          </span>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-sm">
            Kelas Aktif: {data?.debug.rombels_with_presences || 0}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Total Sesi: {data?.debug.total_presences || 0}
          </Badge>
        </div>
      </div>

      {/* Tampilkan rombel dikelompokkan berdasarkan tingkat kelas */}
      {sortedGrades.map((grade) => (
        <div key={grade} className="space-y-4">
          <h2 className="font-medium text-xl">Kelas {grade}</h2>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groupedRombels[grade].map((rombel) => (
              <RombelCard key={rombel.id} rombel={rombel} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Komponen untuk menampilkan kartu rombel tunggal
function RombelCard({ rombel }: { rombel: RombelWithPresence }) {
  const hasActivePresence = !!rombel.presence;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<PresenceStatus | null>(null);

  const hasAttendances = (p: ActivePresence): p is ActivePresence & { attendances: AttendanceRecord[] } => {
    return Array.isArray((p as unknown as { attendances?: unknown }).attendances);
  };

  const statusLabel: Record<"h" | "s" | "i" | "a" | "b", string> = {
    h: "Hadir",
    s: "Sakit",
    i: "Izin",
    a: "Alpha",
    b: "Bolos",
  };

  const filteredStudents = useMemo(() => {
    if (!rombel.presence || !selectedStatus) return [] as Array<{
      student_id: string;
      fullname: string;
      nisn: string | null;
      nipd: string | null;
      photo: string | null;
    }>;
    const attendances: AttendanceRecord[] = hasAttendances(rombel.presence)
      ? rombel.presence.attendances
      : [];
    return attendances
      .filter((a) => a.presence.status === selectedStatus)
      .map((a) => ({
        student_id: a.student_id,
        fullname: a.fullname,
        nisn: a.nisn ?? null,
        nipd: a.nipd ?? null,
        photo: a.photo ?? null,
      }));
  }, [rombel.presence, selectedStatus]);

  return (
    <Card className={hasActivePresence ? "border-green-500 border-2" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between text-lg">
          <span>{rombel.nama}</span>
          {hasActivePresence && <Badge className="bg-green-500">Aktif</Badge>}
        </CardTitle>
        <CardDescription>Tingkat Kelas {rombel.tingkat_kelas}</CardDescription>
      </CardHeader>
      <CardContent>
        {hasActivePresence ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">
                {rombel.presence?.modul.mapel.nama}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{rombel.presence?.modul.teacher.fullname}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-muted-foreground" />
              <span>
                {rombel.presence?.start_time} - {rombel.presence?.end_time}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <span className="font-medium">{rombel.presence?.title}</span>
              <p className="text-muted-foreground line-clamp-2">
                {rombel.presence?.description}
              </p>
            </div>

            {/* Menampilkan statistik kehadiran */}
            <div className="mt-3 pt-2 border-t">
              <div className="mb-1 font-medium text-sm">
                Statistik Kehadiran:
              </div>
              <div className="gap-1 grid grid-cols-5">
                <Badge
                  variant="outline"
                  className="flex flex-col items-center p-1 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-700"
                  onClick={() => {
                    setSelectedStatus("h");
                    setIsDialogOpen(true);
                  }}
                >
                  <span className="font-bold text-green-600">
                    {rombel.presence?.count_h || 0}
                  </span>
                  <span className="text-xs">Hadir</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="flex flex-col items-center p-1 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300 dark:hover:border-yellow-700"
                  onClick={() => {
                    setSelectedStatus("s");
                    setIsDialogOpen(true);
                  }}
                >
                  <span className="font-bold text-yellow-600">
                    {rombel.presence?.count_s || 0}
                  </span>
                  <span className="text-xs">Sakit</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="flex flex-col items-center p-1 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700"
                  onClick={() => {
                    setSelectedStatus("i");
                    setIsDialogOpen(true);
                  }}
                >
                  <span className="font-bold text-blue-600">
                    {rombel.presence?.count_i || 0}
                  </span>
                  <span className="text-xs">Izin</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="flex flex-col items-center p-1 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700"
                  onClick={() => {
                    setSelectedStatus("a");
                    setIsDialogOpen(true);
                  }}
                >
                  <span className="font-bold text-red-600">
                    {rombel.presence?.count_a || 0}
                  </span>
                  <span className="text-xs">Alpha</span>
                </Badge>
                <Badge
                  variant="outline"
                  className="flex flex-col items-center p-1 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700"
                  onClick={() => {
                    setSelectedStatus("b");
                    setIsDialogOpen(true);
                  }}
                >
                  <span className="font-bold text-purple-600">
                    {rombel.presence?.count_b || 0}
                  </span>
                  <span className="text-xs">Bolos</span>
                </Badge>
              </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>
                    {statusLabel[(selectedStatus || "h") as "h"]} - {rombel.nama}
                  </DialogTitle>
                  <DialogDescription>
                    Daftar siswa dengan status "{selectedStatus ? statusLabel[selectedStatus] : ""}" pada sesi ini.
                  </DialogDescription>
                </DialogHeader>

                {(!rombel.presence || !selectedStatus) && (
                  <div className="text-sm text-muted-foreground">
                    Tidak ada data.
                  </div>
                )}

                {rombel.presence && selectedStatus && (
                  <div className="max-h-80 overflow-auto">
                    {filteredStudents.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        Tidak ada siswa.
                      </div>
                    ) : (
                      <ul className="divide-y">
                        {filteredStudents.map((s) => (
                          <li key={s.student_id} className="py-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{s.fullname}</span>
                              <span className="text-xs text-muted-foreground">
                                {s.nipd ? `${s.nipd}` : s.nisn ? `${s.nisn}` : null}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="py-2 text-muted-foreground text-sm">
            Tidak ada sesi presensi aktif
          </div>
        )}
      </CardContent>
    </Card>
  );
}
