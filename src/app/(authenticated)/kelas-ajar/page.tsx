"use client";

import { Separator } from "@/components/ui/separator";
import KelasAjarList from "./components/kelas-ajar-list";
import DialogKelasAjar from "./components/dialog-kelas-ajar";

export default function Page() {
  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="space-y-1 mt-5">
            <h2 className="font-semibold text-2xl tracking-tight">Kelas Ajar</h2>
            <p className="text-muted-foreground text-sm">
              {/* list of all kelas ajar available */}
              Daftar semua kelas ajar yang telah dibuat
            </p>
          </div>
          {/* dialog new kelas ajar */}
          <DialogKelasAjar />
        </div>
        <Separator className="my-4" />
        {/*  */}
        <KelasAjarList />
      </div>
    </div>
  );
}
