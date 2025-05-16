"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthQuery } from "./useAuthQuery";
import { useAuth } from "@/store/useAuth";

/**
 * Hook for client-side route protection
 * Redirects unauthenticated users to the login page
 */
export function useAuthProtection(redirectTo: string = "/login") {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, currentUserQuery } = useAuthQuery();
  const { handleAuthExpired } = useAuth();

  useEffect(() => {
    // Skip if still loading
    if (isLoading || currentUserQuery.isLoading) return;

    // If not authenticated after loading completes, safely redirect
    if (!isAuthenticated) {
      // Get current path for redirect back after login
      const currentPath = window.location.pathname;

      // Use the Next.js router to avoid page reloads
      // Only redirect if not already on the login page
      if (currentPath !== redirectTo) {
        router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
      }
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
    handleAuthExpired, // Expose the handleAuthExpired function
  };
}
