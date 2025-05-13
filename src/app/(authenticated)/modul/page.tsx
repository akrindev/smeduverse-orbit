"use client";

import { Separator } from "@/components/ui/separator";
import ModulList from "./components/modul-list";
import DialogModul from "./components/dialog-modul";

export default function Page() {
  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="space-y-1 mt-5">
            <h2 className="font-semibold text-2xl tracking-tight">Modul</h2>
            <p className="text-muted-foreground text-sm">
              {/* list of all modul available */}
              Daftar semua modul yang telah dibuat
            </p>
          </div>
          {/* dialog new modul */}
          <DialogModul />
        </div>
        <Separator className="my-4" />
        {/*  */}
        <ModulList />
      </div>
    </div>
  );
}
