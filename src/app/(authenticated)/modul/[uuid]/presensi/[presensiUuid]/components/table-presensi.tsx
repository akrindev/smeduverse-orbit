import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function TablePresensi() {
  const dummyData = [
    {
      nis: "12345",
      name: "Syakirin Amin",
      status: "Hadir",
    },
    {
      nis: "12346",
      name: "Nanang Hermanto",
      status: "Hadir",
    },
    {
      nis: "12347",
      name: "Rio Aprianto",
      status: "Hadir",
    },
    {
      nis: "12348",
      name: "Leni Pratiwi",
      status: "Hadir",
    },
    {
      nis: "12349",
      name: "Muhimmatul Iffadah",
      status: "Hadir",
    },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>NIS</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Note</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyData.map((data, i) => (
          <TableRow key={data.nis}>
            <TableCell className="w-[50px]">{i + 1}</TableCell>
            <TableCell className="w-[110px]">{data.nis}</TableCell>
            <TableCell className="truncate max-w-[500px] font-medium">
              {data.name}
            </TableCell>
            <TableCell>
              <div className="relative w-max">
                <select
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-[200px] appearance-none bg-transparent font-normal"
                  )}
                >
                  <option value="h">Hadir</option>
                  <option value="i">Izin</option>
                  <option value="s">Sakit</option>
                  <option value="a">Alpa</option>
                  <option value="b">Bolos</option>
                </select>

                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
              </div>
            </TableCell>
            <TableCell>
              <Input type="text" placeholder="Note" className="min-w-[150px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
