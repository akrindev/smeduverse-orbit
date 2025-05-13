"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type Analytics = {
  name: string;
  value: number;
};

async function getAnalytics() {
  const response = await api.get<Analytics[]>("/analytics");
  return response.data;
}

export default function AnalyticsCard() {
  const [analitycs, setAnalitycs] = useState<Analytics[]>([]);

  useEffect(() => {
    getAnalytics().then((data) => setAnalitycs(data));
  }, [analitycs]);

  return (
    <div className='gap-4 grid md:grid-cols-2 lg:grid-cols-4 mt-5'>
      {analitycs.map((item) => (
        <Card
          key={item.name}
          className='shadow-md hover:scale-105 duration-500 cursor-pointer'>
          <CardHeader className='flex flex-row justify-between items-center space-y-0 pb-2'>
            <CardTitle className='font-medium text-sm'>{item.name}</CardTitle>
            {/* <DollarSign className="w-4 h-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className='font-bold text-2xl'>{item.value}</div>
            {/* <p className="text-muted-foreground text-xs">
                  jumlah keseluruhan mapel
                </p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
