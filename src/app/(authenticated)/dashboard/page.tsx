"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import ModulList from "../modul/components/modul-list";
import { api } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { LayoutSidebar } from "@/components/layout-sidebar";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

// revalidate every 5 seconds
// export const revalidate = 5;

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Halaman utama",
// };

export default function Page() {
  const [analitycs, setAnalyticsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAnalytics() {
      const session = await getSession();

      if (!session || !session.user.access_token) {
        throw new Error("Unauthorized");
      }

      const response = await api.get("/analytics");
      setAnalyticsData(response.data);
      setIsLoading(false);
    }

    fetchAnalytics().catch(console.error);
  }, []);

  // console.log(analitycs);

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-5 h-full">
        <Skeleton className="w-[250px] h-4" />
        <Skeleton className="w-[350px] h-4" />
        <Skeleton className="w-[350px] h-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 h-full">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground text-sm">
              Selamat datang kembali
            </p>
          </div>
        </div>

        <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4 mt-5">
          {analitycs.map((item) => (
            <Card
              key={item.name}
              className="shadow-md hover:scale-105 duration-500 cursor-pointer"
            >
              <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                <CardTitle className="font-medium text-sm">
                  {item.name}
                </CardTitle>
                {/* <DollarSign className="w-4 h-4 text-muted-foreground" /> */}
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{item.value}</div>
                {/* <p className="text-muted-foreground text-xs">
                  jumlah keseluruhan mapel
                </p> */}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-5">
          <div className="space-y-1 mt-6">
            <h2 className="font-semibold text-2xl tracking-tight">Modul</h2>
            <p className="text-muted-foreground text-sm">
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
