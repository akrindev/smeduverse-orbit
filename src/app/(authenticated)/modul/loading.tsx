"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className='flex flex-col space-y-5 h-full'>
      <div className='flex flex-col h-full'>
        <div className='space-y-1 mt-5'>
          <h2 className='font-semibold text-2xl tracking-tight'>Modul</h2>
          <p className='text-muted-foreground text-sm'>
            {/* list of all modul available */}
            Daftar semua modul yang telah dibuat
          </p>
        </div>
        <Separator className='my-4' />
        <div className='relative'>
          <ScrollArea>
            <div className='gap-5 grid grid-cols-12'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div className='space-y-1 col-span-6 md:col-span-3' key={index}>
                  {/* cover */}
                  <div className='relative hover:scale-105 rounded-md duration-500'>
                    <Skeleton className='w-full h-40 object-cover' />
                  </div>
                  {/* more basic information of modul */}
                  <div className='space-y-1'>
                    <Skeleton className='w-[250px] h-4' />
                    <Skeleton className='w-[350px] h-4' />
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
