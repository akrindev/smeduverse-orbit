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
  } = useAuth();

  // Query for the current user
  const currentUserQuery = useQuery({
    queryKey: authQueryKeys.currentUser,
    queryFn: async (): Promise<User | null> => {
      try {
        // Instead of making a request to /auth/me, use the existing user from the Zustand store
        if (isAuthenticated && user) {
          return user;
        }

        // If no authenticated user in the store, return null
        setUser(null);
        setToken(null, null);
        return null;
      } catch (error) {
        // Update the Zustand store on error
        setUser(null);
        setToken(null, null);
        return null;
      }
    },
    // Don't automatically refetch on focus/reconnect to avoid
    // unnecessary loading states during normal app usage
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    // This will be useful for initializing auth state
    retry: false,
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
      setLoading(true);
      setError(null);

      // Login attempt
      const response = await api.post("/auth/login", { email, password });

      return response.data;
    },
    onSuccess: async (data) => {
      // Extract token and user data from the response
      const { access_token, token_type, user } = data;

      // Save token
      setToken(access_token, token_type);

      // Set user data
      setUser(user);

      // Update React Query cache
      queryClient.setQueryData(authQueryKeys.currentUser, user);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
      setToken(null, null);
      setLoading(false);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      setLoading(true);
      return await api.post("/auth/logout");
    },
    onSuccess: () => {
      // Clear user data and token from store
      setUser(null);
      setToken(null, null);

      // Invalidate the current user query
      queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser });

      // Redirect to login page
      router.push("/login");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Even on error, clear the user data and token for security
      setUser(null);
      setToken(null, null);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  // Function to check if user is authenticated and redirect if not
  const requireAuth = (redirectTo: string = "/login") => {
    // If we're not loading and not authenticated, redirect
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectPath = `${redirectTo}?from=${encodeURIComponent(
        currentPath
      )}`;
      router.push(redirectPath);
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
