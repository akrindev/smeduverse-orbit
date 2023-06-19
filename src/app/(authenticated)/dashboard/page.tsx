import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ModulList from "../modul/components/modul-list";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Halaman utama",
};

export default function Page() {
  const analitycs: Array<{
    name: string;
    value: number;
  }> = [
    {
      name: "Mata Pelajaran",
      value: 721,
    },
    {
      name: "Modul",
      value: 52,
    },
    {
      name: "Materi",
      value: 4573,
    },
    {
      name: "Presensi",
      value: 2234,
    },
  ];

  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Selamat datang kembali
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analitycs.map((item) => (
            <Card
              key={item.name}
              className="shadow-md hover:scale-105 duration-500 cursor-pointer"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.name}
                </CardTitle>
                {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                {/* <p className="text-xs text-muted-foreground">
                  jumlah keseluruhan mapel
                </p> */}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-5">
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Modul</h2>
            <p className="text-sm text-muted-foreground">
              Modul yang kamu kelola
            </p>
          </div>
          <Separator className="my-4" />
          <ModulList owned />
        </div>
      </div>
    </div>
  );
}
