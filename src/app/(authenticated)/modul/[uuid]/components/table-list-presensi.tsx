"use client";

import { Badge } from "@/components/ui/badge";
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
import { usePresence } from "@/store/usePresence";
import { Presence } from "@/types/presence";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const colors = {
  H: "bg-green-500",
  S: "bg-yellow-500",
  I: "bg-blue-500",
  A: "bg-red-500",
  B: "bg-red-500",
};

export default function TableListPresensi({
  modulUuid,
}: {
  modulUuid: string;
}) {
  const [presences, fetchPresences] = usePresence<
    [Presence[], (modulUuid: string) => void]
  >((state) => [state.presences, state.fetchPresences]);

  const router = useRouter();

  useEffect(() => {
    fetchPresences(modulUuid);
  }, [modulUuid]);

  const handleViewPresence = (presence: Presence) => {
    router.push(`/modul/${modulUuid}/presensi/${presence.uuid}`);
  };
  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-left w-10'>No</TableHead>
            <TableHead className='text-left'>Judul</TableHead>
            <TableHead className='text-left'>Deskripsi</TableHead>
            <TableHead className='text-left'>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* list of all presences */}
          {presences.length ? (
            presences.map((presence: Presence, i: number) => (
              <TableRow
                key={presence.uuid}
                onClick={() => handleViewPresence(presence)}
                className='cursor-pointer'>
                <TableCell>{presences.length - i}</TableCell>
                <TableCell className='p-2 text-left max-w-[130px] whitespace-pre-line truncate'>
                  <TooltipText text={presence.title} />
                </TableCell>
                <TableCell className='p-2 text-left max-w-[420px] whitespace-pre-line truncate'>
                  {presence.description}
                </TableCell>
                <TableCell className='p-2 text-left'>
                  <div className='flex flex-wrap gap-1 text-left'>
                    {/* count_[a,i,s,b,a] */}
                    {["h", "i", "s", "b", "a"].map(
                      (status) =>
                        presence[`count_${status}`] > 0 && (
                          <Badge
                            className={
                              "text-white " +
                              colors[status.slice(0, 5).toUpperCase()]
                            }
                            variant={"outline"}
                            key={presence.uuid + status}>
                            {status.toUpperCase()}:{" "}
                            {presence[`count_${status}`]}
                          </Badge>
                        )
                    )}
                  </div>
                  <div className='text-muted-foreground'>
                    {/* format day name, PPP */}
                    {format(new Date(presence.date), "EEEE, PPP", {
                      locale: id,
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>
                {/* desciption that the data is empty */}
                <div className='flex flex-col items-center justify-center space-y-2'>
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
