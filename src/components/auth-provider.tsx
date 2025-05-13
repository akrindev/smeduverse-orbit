"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/store/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { authQueryKeys } from "@/hooks/useAuthQuery";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider handles authentication state initialization and syncing
 * It ensures that:
 * 1. Persisted auth state is properly loaded
 * 2. React Query cache is updated with the user data
 * 3. Token is available for API requests
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { user, accessToken, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Initialize authentication state on app load
  useEffect(() => {
    // If we have a user from persisted state, update React Query cache
    if (user && isAuthenticated) {
      // Set the user in React Query cache
      queryClient.setQueryData(authQueryKeys.currentUser, user);

      console.log("Auth state initialized from persisted storage");
    } else {
      console.log("No persisted auth state found");
    }
  }, []);

  return <>{children}</>;
}

export default AuthProvider;
