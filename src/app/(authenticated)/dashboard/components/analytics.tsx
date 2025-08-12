// src/app/(authenticated)/dashboard/components/analytics.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

type Analytics = {
  // Define the structure of your analytics data here
  // Example:
  totalUsers: number;
  totalModules: number;
};

async function getAnalytics(): Promise<Analytics[]> {
  const response = await api.get<Analytics[]>("/analytics");
  return response.data; // Assuming response.data directly contains the array
}

export default function AnalyticsCard() {
  const [analitycs, setAnalitycs] = useState<Analytics[]>([]);

  useEffect(() => {
    getAnalytics().then((data) => setAnalitycs(data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {analitycs.length > 0 ? (
          <div>
            {/* Display your analytics data here */}
            <p>Total Users: {analitycs[0]?.totalUsers}</p>
            <p>Total Modules: {analitycs[0]?.totalModules}</p>
          </div>
        ) : (
          <p>Loading analytics data...</p>
        )}
      </CardContent>
    </Card>
  );
}