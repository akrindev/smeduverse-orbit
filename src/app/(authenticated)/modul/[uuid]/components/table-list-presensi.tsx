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
    router.push(`/modul/${modulUuid}/presensi/${presence.orbit_modul_uuid}`);
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
          {presences.length <= 0 ? (
            // skeleton
            <TableRow>
              <TableCell>
                <Skeleton className="h-5 w-full bg-gray-300" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full bg-gray-300" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-full bg-gray-300" />
              </TableCell>
            </TableRow>
          ) : (
            presences.map((presence: Presence) => (
              <TableRow
                onClick={() => handleViewPresence(presence)}
                className="cursor-pointer hover:bg-gray-100"
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
