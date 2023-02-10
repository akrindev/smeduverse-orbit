"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data, status } = useSession();

  if (status == "loading") {
    return "loading dulu cuy";
  }

  console.log(data);

  return <>Hello Smeduverse Orbit Dashboard {data && data.user.email}</>;
}
