// this is the component that is used to display the module card

import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ModulCard({
  modul,
  className,
}: {
  modul: any;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1 col-span-6 md:col-span-3", className)}>
      {/* cover */}
      <div className="relative hover:scale-105 duration-500 rounded-md ">
        <Image
          src={modul.cover}
          alt={modul.mapel}
          width={200}
          height={200}
          className="w-full h-40 object-cover"
        />
      </div>
      {/* more basic information of modul */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{modul.mapel}</h3>
        <p className="text-sm text-muted-foreground">
          {modul.class} - {modul.owner}
        </p>
      </div>
    </div>
  );
}
