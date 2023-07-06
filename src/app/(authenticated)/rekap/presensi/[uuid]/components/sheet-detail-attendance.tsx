import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Attendance, OrbitPresence } from "@/types/attendance";

const colors = {
  H: "text-green-500",
  S: "text-yellow-500",
  I: "text-blue-500",
  A: "text-red-500",
  B: "text-red-500",
};

export default function SheetDetailAttendance({
  attendance,
}: {
  attendance: Attendance;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          {attendance.nipd} - {attendance.fullname}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="my-5">
          <div className="flex flex-col space-y-5">
            {/* name */}
            <div>
              <div className="text-sm font-medium text-gray-500">Nama</div>
              <div className="text-lg font-semibold">{attendance.fullname}</div>
            </div>
            {/* nipd */}
            <div>
              <div className="text-sm font-medium text-gray-500">NIS</div>
              <div className="text-lg font-semibold">{attendance.nipd}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">KEHADIRAN</div>
              <div className="text-lg font-semibold space-x-2">
                {Object.entries(attendance.status_count!).map(
                  ([key, value]) => (
                    <Badge variant={"outline"} key={key}>
                      {key.toUpperCase()}: {value}
                    </Badge>
                  )
                )}
              </div>
            </div>
            {/* kehadiran */}
          </div>
        </div>

        {attendance.orbit_presence?.length ? (
          <ScrollArea className="h-[450px] border rounded-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Presensi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.orbit_presence.map((presence: OrbitPresence) => (
                  <TableRow key={presence.uuid + presence.presence.student_id}>
                    <TableCell>{presence.title}</TableCell>
                    <TableCell>
                      <span
                        className={`font-medium uppercase ${
                          colors[presence.presence.status.toUpperCase()]
                        }`}
                      >
                        {presence.presence.status}
                      </span>
                    </TableCell>
                    <TableCell>{presence.presence.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ) : (
          <div className="p-5 text-center">belum ada presensi</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
