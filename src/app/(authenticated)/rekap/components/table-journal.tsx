import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function TableJournal({ journals }) {
  return journals.length > 0 ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Modul</TableHead>
          <TableHead>Judul</TableHead>
          <TableHead>Deskripsi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {journals.map((journal) => (
          <TableRow key={journal.uuid}>
            <TableCell>
              <div className='flex flex-col'>
                <div className='font-medium'>{journal.modul.mapel.nama}</div>
                <span className='text-muted-foreground'>
                  {journal.modul.teacher.fullname}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex flex-col'>
                <div className='font-medium'>{journal.title}</div>
                <span className='text-muted-foreground'>
                  {/* date */}
                  {format(new Date(journal.date), "dd MMMM yyyy", {
                    locale: id,
                  })}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className='flex flex-col'>
                <div className='text-muted-foreground'>
                  {journal.modul.rombel?.nama}
                </div>
                <span>{journal.description}</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <div className='my-12 flex justify-center items-center h-full'>
      <div className='flex flex-col items-center'>
        <div className='text-2xl font-semibold'>Belum ada data</div>
        <div className='text-md font-normal'>
          Tidak ada data untuk ditampilkan
        </div>
      </div>
    </div>
  );
}
