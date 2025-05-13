"use client";

import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Hook for client-side authentication checks
export function useAuthCheck(redirectTo: string = "/login") {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the auth state is loading, wait
    if (authLoading) {
      return;
    }

    // If there's no user (not authenticated)
    if (!isAuthenticated || !user) {
      // Add the current path to redirect back after login
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
      return;
    }

    // User is authenticated
    setIsLoading(false);
  }, [user, isAuthenticated, authLoading, router, redirectTo]);

  return {
    isAuthenticated,
    isLoading: authLoading || isLoading,
    user,
  };
}
