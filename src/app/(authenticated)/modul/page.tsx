import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ModulList from "./components/modul-list";
import DialogModul from "./components/dialog-modul";
import { isWakaKurikulum } from "@/lib/auth-role";

export const metadata: Metadata = {
  title: "Modul",
  description: "Daftar semua modul yang telah dibuat",
};

export default async function Page() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mt-5 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Modul</h2>
            <p className="text-sm text-muted-foreground">
              {/* list of all modul available */}
              Daftar semua modul yang telah dibuat
            </p>
          </div>
          {/* dialog new modul */}
          {(await isWakaKurikulum()) && <DialogModul />}
        </div>
        <Separator className="my-4" />
        {/*  */}
        <ModulList />
      </div>
    </div>
  );
}
