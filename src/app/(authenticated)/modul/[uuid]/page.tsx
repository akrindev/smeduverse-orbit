import { Separator } from "@/components/ui/separator";
import TableListPresensi from "./components/table-list-presensi";
import { getModulInfo } from "./layout";
import DialogCreatePresensi from "./components/dialog-create-presensi";

export async function generateMetadata({ params }) {
  const { data } = await getModulInfo(params.uuid);

  return {
    title: data.mapel.nama,
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
        <div className="col-span-12 md:col-span-6 flex items-center justify-end">
          <DialogCreatePresensi modulUuid={params.uuid} />
        </div>
      </div>
      <Separator />
      <TableListPresensi modulUuid={params.uuid} />
    </div>
  );
}
