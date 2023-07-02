"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { usePresence } from "@/store/usePresence";
import { Presence } from "@/types/presence";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TableListPresensi({
  modulUuid,
}: {
  modulUuid: string;
}) {
  const [presences, fetchPresences] = usePresence((state) => [
    state.presences,
    state.fetchPresences,
  ]);

  const router = useRouter();

  useEffect(() => {
    fetchPresences(modulUuid);
  }, [modulUuid]);

  const handleViewPresence = (presence: Presence) => {
    router.push(`/modul/${modulUuid}/presensi/${presence.uuid}`);
  };
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Judul</TableHead>
            <TableHead className="text-left">Deskripsi</TableHead>
            <TableHead className="text-left">Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* list of all presences */}
          {presences.length ? (
            presences.map((presence: Presence) => (
              <TableRow
                key={presence.uuid}
                onClick={() => handleViewPresence(presence)}
                className="cursor-pointer"
              >
                <TableCell className="text-left max-w-[130px] truncate">
                  <TooltipText text={presence.title} />
                </TableCell>
                <TableCell className="text-left max-w-lg truncate">
                  <TooltipText text={presence.description} />
                </TableCell>
                <TableCell className="text-left">
                  {new Date(presence.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>
                {/* desciption that the data is empty */}
                <div className="flex flex-col items-center justify-center space-y-2">
                  <p>Belum ada data presensi untuk ditampilkan</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// tooltip
function TooltipText({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>{text}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
