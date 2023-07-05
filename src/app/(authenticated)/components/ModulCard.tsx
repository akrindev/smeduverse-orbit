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
import { isUser } from "@/lib/auth-role";

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
      className={cn(
        "hover:shadow-xl hover:scale-95 duration-300 space-y-1 col-span-6 md:col-span-3",
        className
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>{modul.rombel.nama}</CardTitle>
          <CardDescription className="text-xs">
            {modul.mapel.nama}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{modul.teacher.fullname}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
