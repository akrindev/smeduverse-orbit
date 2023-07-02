"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function BaseLoading() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col min-w-full">
          <div className="mt-5 space-y-1">
            <Skeleton className="h-8 w-24 text-2xl font-semibold tracking-tight" />
            <Skeleton className="h-8 w-1/3 text-sm text-muted-foreground" />
            <Skeleton className="h-8 w-1/2 text-sm text-muted-foreground" />
            <Skeleton className="h-8 w-1/2 text-sm text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
