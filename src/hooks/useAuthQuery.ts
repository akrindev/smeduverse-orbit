"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth, User } from "@/store/useAuth";
import { useRouter } from "next/navigation";

// Authentication query keys
export const authQueryKeys = {
  currentUser: ["currentUser"],
};

/**
 * React Query hook for authentication operations
 */
export function useAuthQuery() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Access the Zustand auth store
  const {
    setUser,
    setToken,
    setLoading,
    setError,
    user,
    accessToken,
    tokenType,
    isAuthenticated,
    isLoading,
    error,
    login: zustandLogin,
    logout: zustandLogout,
  } = useAuth();

  // Query for the current user - simplified to just use the persisted state
  const currentUserQuery = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: async (): Promise<User | null> => {
      // Simply return the user from Zustand store
      return user;
    },
    // Enable stale time to prevent frequent refetching
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    // Don't automatically refetch on focus/reconnect
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    // The initial data is already in the Zustand store
    initialData: user,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      // Use the Zustand login function
      const result = await zustandLogin(email, password);
      if (!result.success) {
        throw new Error(result.error || "Login failed");
      }
      return { user };
    },
    onSuccess: () => {
      // Update React Query cache
      queryClient.setQueryData(authQueryKeys.currentUser, user);
    },
    onError: (error: any) => {
      console.error("Login error:", error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Use the Zustand logout function
      await zustandLogout();
      return true;
    },
    onSuccess: () => {
      // Invalidate the current user query
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser });
      // Redirect to login page
      router.push("/login");
    },
  });

  // Function to check if user is authenticated and redirect if not
  const requireAuth = (redirectTo: string = "/login") => {
    // Check if we already have authenticated user data in the store
    // If authenticated, return early without triggering any API calls
    if (isAuthenticated && user) {
      return {
        isAuthenticated: true,
        isLoading: false,
        user,
      };
    }

    // If we're not loading and not authenticated, redirect
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      // Avoid redirecting to login if already on login page
      if (currentPath !== "/login" && currentPath !== redirectTo) {
        // Use Next.js router instead of direct browser navigation
        router.push(`${redirectTo}?from=${encodeURIComponent(currentPath)}`);
      }
    }

    return {
      isAuthenticated,
      isLoading,
      user,
    };
  };

  return {
    // State from Zustand store
    user,
    accessToken,
    tokenType,
    isAuthenticated,
    isLoading,
    error,

    // Queries and mutations
    currentUserQuery,
    loginMutation,
    logoutMutation,

    // Utility functions
    requireAuth,
    refreshUser: () =>
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser }),
  };
}
