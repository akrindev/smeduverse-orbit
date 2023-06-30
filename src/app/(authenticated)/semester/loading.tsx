"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mt-5 space-y-1">
            <Skeleton className="h-14 w-24 text-2xl font-semibold tracking-tight" />
            <Skeleton className="h-14 w-40 text-sm text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
