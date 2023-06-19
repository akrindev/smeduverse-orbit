import { Separator } from "@/components/ui/separator";
import TablePresensi from "./components/table-presensi";
import Information from "./components/information";
import { api } from "@/lib/api";
import { IAttendance } from "@/types/attendance";

async function getAttendance({
  presensiUuid,
}: {
  presensiUuid: string;
}): Promise<IAttendance> {
  const { data } = await api.get(`/modul/presence/show/${presensiUuid}`);

  return data;
}

export default async function PreseniPage({
  params,
}: {
  params: { uuid: string; presensiUuid: string };
}) {
  const attendances = await getAttendance(params);

  console.log(attendances);

  return (
    <div>
      <Information
        title={attendances.title}
        description={attendances.description}
      />
      <Separator className="my-4" />
      <div className="rounded-md border">
        <TablePresensi attendances={attendances.attendances} />
      </div>
    </div>
  );
}
