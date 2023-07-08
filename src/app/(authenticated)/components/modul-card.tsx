// this is the component that is used to display the module card

import { cn } from "@/lib/utils";
import { Modul } from "@/types/modul";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ModulCard({
  modul,
  className,
  isUser,
}: {
  modul: Modul;
  className?: string;
  isUser?: boolean;
}) {
  return (
    <Link
      href={isUser ? `/modul/${modul.uuid}` : `/rekap/presensi/${modul.uuid}`}
      className="space-y-1 col-span-12 md:col-span-4"
    >
      <Card
        className={cn("hover:shadow-xl hover:scale-95 duration-300", className)}
      >
        <CardHeader>
          <CardTitle>{modul.rombel.nama}</CardTitle>
          <CardDescription className="text-xs">
            {modul.semester?.name} | {modul.teacher.fullname}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm space-x-3">
            <Badge>{modul.mapel.kode}</Badge>
            <span>{modul.mapel.nama}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
