"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePresence } from "@/store/usePresence";
import { Presence } from "@/types/presence";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ViewSwitcher from "@/components/ui/view-switcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TablePresences({ modulUuid }: { modulUuid: string }) {
  const [presences, fetchPresences] = usePresence((state) => [
    state.presences,
    state.fetchPresences,
  ]);
  const [view, setView] = useState<"table" | "grid">("table");

  useEffect(() => {
    fetchPresences(modulUuid);
  }, [modulUuid, fetchPresences]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Daftar Presensi</CardTitle>
          <CardDescription>Daftar semua presensi yang terdaftar</CardDescription>
        </div>
        <ViewSwitcher onViewChange={setView} />
      </CardHeader>
      <CardContent>
        {presences.length === 0 ? (
          <div className="text-center py-8">Tidak ada presensi</div>
        ) : view === "table" ? (
          <PresenceTable presences={presences} />
        ) : (
          <PresenceGrid presences={presences} />
        )}
      </CardContent>
    </Card>
  );
}

function PresenceTable({ presences }: { presences: Presence[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left w-10">No</TableHead>
          <TableHead className="text-left">Judul</TableHead>
          <TableHead className="text-left">Deskripsi</TableHead>
          <TableHead className="text-left">Tanggal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {presences.map((presence: Presence, i) => (
          <TableRow key={presence.uuid} className="cursor-pointer">
            <TableCell>{presences.length - i}</TableCell>
            <TableCell>{presence.title}</TableCell>
            <TableCell>{presence.description}</TableCell>
            <TableCell>
              {format(new Date(presence.date), "EEEE, PPP", {
                locale: id,
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function PresenceGrid({ presences }: { presences: Presence[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {presences.map((presence) => (
        <Card key={presence.uuid} className="cursor-pointer">
          <CardHeader>
            <CardTitle>{presence.title}</CardTitle>
            <CardDescription>{presence.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {format(new Date(presence.date), "EEEE, PPP", {
              locale: id,
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
