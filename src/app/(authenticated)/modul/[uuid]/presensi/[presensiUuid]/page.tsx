import { Separator } from "@/components/ui/separator";
import TablePresensi from "./components/table-presensi";
import Information from "./components/information";

export default function PreseniPage({
  params,
}: {
  params: { presensiUuid: string };
}) {
  return (
    <div>
      <Information
        title="Membuat Aplikasi Web"
        description="Membuat aplikasi web dengan menggunakan ReactJS"
      />
      <Separator className="my-4" />
      <div className="rounded-md border">
        <TablePresensi />
      </div>
    </div>
  );
}
