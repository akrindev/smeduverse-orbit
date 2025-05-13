"use client";

import { ReactQueryProvider } from "@/components/react-query-provider";
import { Router } from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import { AuthProvider } from "@/components/auth-provider";

// Progress bar configuration for navigation
const progress = new ProgressBar({
  size: 2,
  color: "#22c55e",
  className: "bar-of-progress",
  delay: 100,
});

// Initialize progress bar events
if (typeof window !== "undefined") {
  Router.events.on("routeChangeStart", progress.start);
  Router.events.on("routeChangeComplete", progress.finish);
  Router.events.on("routeChangeError", progress.finish);
}

// Main providers component that wraps the application
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </ReactQueryProvider>
  );
}
