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

export default function PreseniPage({
  params,
}: {
  params: { presensiUuid: string };
}) {
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
    <div className="rounded-md border">
      {/* make table that has nis, name, status */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIS</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyData.map((data) => (
            <TableRow key={data.nis}>
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
                    <option value="inter">Inter</option>
                    <option value="manrope">Manrope</option>
                    <option value="system">System</option>
                  </select>

                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                </div>
              </TableCell>
              <TableCell>
                <Input type="text" placeholder="Note" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
