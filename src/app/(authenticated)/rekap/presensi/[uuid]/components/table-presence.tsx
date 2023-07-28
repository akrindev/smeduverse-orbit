import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePresence } from "@/store/usePresence";
import { Presence } from "@/types/presence";
import format from "date-fns/format";
import id from "date-fns/locale/id";
import { useEffect } from "react";

export default function TablePresences({ modulUuid }: { modulUuid: string }) {
  const [presences, fetchPresences] = usePresence((state) => [
    state.presences,
    state.fetchPresences,
  ]);

  useEffect(() => {
    fetchPresences(modulUuid);
  }, [modulUuid]);

  return (
    <div className='border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-left w-10'>No</TableHead>
            <TableHead className='text-left'>Judul</TableHead>
            <TableHead className='text-left'>Deskripsi</TableHead>
            <TableHead className='text-left'>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* list of all presences */}
          {presences.length ? (
            presences.map((presence: Presence, i) => (
              <TableRow key={presence.uuid} className='cursor-pointer'>
                <TableCell>{presences.length - i}</TableCell>
                <TableCell>{presence.title}</TableCell>
                <TableCell>{presence.description}</TableCell>
                <TableCell>
                  {format(new Date(presence.date), "EEEE, PPP", {
                    locale: id,
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className='text-center'>
                Tidak ada presensi
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
