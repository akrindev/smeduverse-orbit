"use client";

import { ReactQueryProvider } from "@/components/react-query-provider";
import ProgressBar from "@badrap/bar-of-progress";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AuthProvider } from "@/components/auth-provider";

// Progress bar configuration
const progress = new ProgressBar({
  size: 2,
  color: "#22c55e",
  className: "bar-of-progress",
  delay: 100,
});

// Main providers component that wraps the application
export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Handle route changes for progress bar
  useEffect(() => {
    progress.finish();
    // The combination of pathname and search params changing means a navigation occurred
  }, [pathname, searchParams]);

  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}
