import { Separator } from "@/components/ui/separator";
import TableListPresensi from "./components/table-list-presensi";
import { getModulInfo } from "./layout";
import DialogPresensi from "./components/dialog-presensi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { FileText } from "lucide-react";

export async function generateMetadata({ params }) {
  const { data } = await getModulInfo(params.uuid);

  return {
    title: `Modul ${data.mapel.nama}`,
    // make summary of modul description
    description: `Modul oleh ${data.teacher.fullname} - ${data.rombel.nama}`,
  };
}

export default function ModulPage({ params }: { params: { uuid: string } }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-6">
          <h3 className="text-lg font-medium">Presensi</h3>
          <p className="text-sm text-muted-foreground">
            Daftar presensi yang telah dibuat
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 flex items-center justify-end gap-3">
          <DialogPresensi modulUuid={params.uuid} />
          <Link href={`/rekap/presensi/${params.uuid}`}>
            <Button variant={`outline`}>
              <FileText className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <Separator />
      <TableListPresensi modulUuid={params.uuid} />
    </div>
  );
}
