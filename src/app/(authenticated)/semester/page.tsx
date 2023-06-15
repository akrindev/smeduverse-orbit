import { Separator } from "@/components/ui/separator";
import TableSemester from "./components/table-semester";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";
import DialogCreateSemester from "./components/dialog-create-semester";

export default function SemesterPage() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mt-5 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Semester</h2>
            <p className="text-sm text-muted-foreground">
              Kelola data semester
            </p>
          </div>
          <DialogCreateSemester />
        </div>
        <Separator className="my-4" />
        <Alert>
          <IconInfoCircle className="w-5 h-5 mr-2" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>
            Jika kamu menambahkan semester baru, maka semester yang baru
            ditambahkan akan menjadi semester aktif dan semester sebelumnya akan
            menjadi tidak aktif. kamu dapat mengubah semester aktif jika
            terdapat kesalahan saat prosesi input semester. Jika kamu menghapus
            semester aktif, maka semester yang sebelumnya akan diganti menjadi
            semester aktif saat ini.
          </AlertDescription>
        </Alert>
        <div className="my-4"></div>
        {/* table of semester that has title and status */}
        <TableSemester />
      </div>
    </div>
  );
}
