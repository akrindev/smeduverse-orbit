"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Hook for client-side authentication checks
export function useAuthCheck(redirectTo: string = "/login") {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the session is loading, wait
    if (status === "loading") {
      return;
    }

    // If there's no session (not authenticated)
    if (!session) {
      // Add the current path to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
      return;
    }

    // User is authenticated
    setIsLoading(false);
  }, [session, status, router, redirectTo]);

  return {
    isAuthenticated: !!session,
    isLoading: status === "loading" || isLoading,
    session,
  };
}
