"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="mt-5 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Modul</h2>
          <p className="text-sm text-muted-foreground">
            {/* list of all modul available */}
            Daftar semua modul yang telah dibuat
          </p>
        </div>
        <Separator className="my-4" />
        <div className="relative">
          <ScrollArea>
            <div className="grid grid-cols-12 gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div className="space-y-1 col-span-6 md:col-span-3" key={index}>
                  {/* cover */}
                  <div className="relative hover:scale-105 duration-500 rounded-md ">
                    <Skeleton className="w-full h-40 object-cover" />
                  </div>
                  {/* more basic information of modul */}
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
