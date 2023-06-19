// this is the component that is used to display the module card

import { cn } from "@/lib/utils";
import { Modul } from "@/types/modul";
import Link from "next/link";
import Image from "next/image";

export default function ModulCard({
  modul,
  className,
}: {
  modul: Modul;
  className?: string;
}) {
  return (
    <Link
      href={`/modul/${modul.uuid}`}
      className={cn("space-y-1 col-span-6 md:col-span-3", className)}
    >
      {/* cover */}
      <div className="relative hover:scale-105 duration-500 rounded-md overflow-visible">
        <Image
          src="https://picsum.photos/seed/picsum/500/500"
          alt={"cover"}
          width={400}
          height={200}
          className="w-full h-40 object-cover rounded-md"
        />
      </div>
      {/* more basic information of modul */}
      <div className="space-y-0.5">
        <h3 className="text-md font-semibold">{modul.mapel.nama}</h3>
        <p className="text-xs text-muted-foreground">
          {modul.rombel.nama} - {modul.teacher.fullname}
        </p>
      </div>
    </Link>
  );
}
