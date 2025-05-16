"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthQuery } from "./useAuthQuery";

/**
 * Hook for client-side route protection
 * Redirects unauthenticated users to the login page
 */
export function useAuthProtection(redirectTo: string = "/login") {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, currentUserQuery } = useAuthQuery();

  useEffect(() => {
    // Skip if still loading
    if (isLoading || currentUserQuery.isLoading) return;

    // If not authenticated after loading completes, redirect
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
    }
  }, [
    isAuthenticated,
    isLoading,
    currentUserQuery.isLoading,
    router,
    redirectTo,
  ]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || currentUserQuery.isLoading,
  };
}
