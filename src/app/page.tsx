"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data, status } = useSession();

  if (status === "loading") {
    return <>Loading...</>;
  }

  // if not authenticated
  if (status === "unauthenticated") {
    return redirect("/login");
  }

  // if authenticated
  return redirect("/dashboard");
}
