"use client";

import { Separator } from "@/components/ui/separator";

export default function KehadiranSiswa() {
  return (
    <div className='flex flex-col space-y-5 h-full'>
      <div className='flex flex-col h-full'>
        <div className='flex md:flex-row flex-col justify-between'>
          <div className='space-y-1 mt-5'>
            <h2 className='font-semibold text-2xl tracking-tight'>
              Daftar kehadiran siswa
            </h2>
            <p className='text-muted-foreground text-sm'>
              {/* list of all modul available */}
              Daftar kehadiran siswa yang terdaftar
            </p>
          </div>
        </div>
        <Separator className='my-4' />
        {/*  */}
      </div>
    </div>
  );
}
