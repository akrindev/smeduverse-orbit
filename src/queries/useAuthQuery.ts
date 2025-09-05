"use client";

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Types for authentication
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface LoginResponse {
	access_token: string;
	token_type: string;
	user: User;
}

export interface User {
	id: string;
	email: string;
	name?: string;
	fullname?: string;
	teacher?: {
		fullname?: string;
		niy?: string;
		photo?: string;
	};
}

// Query keys for auth-related queries
export const authQueryKeys = {
	currentUser: ["auth", "current-user"],
};

/**
 * React Query hook for user login
 */
export function useLoginMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			credentials: LoginCredentials,
		): Promise<LoginResponse> => {
			const response = await api.post("/auth/login", credentials);
			return response.data;
		},
		onSuccess: (_data) => {
			// Invalidate current user query to refresh user data
			queryClient.invalidateQueries({
				queryKey: authQueryKeys.currentUser,
			});
		},
	});
}

/**
 * React Query hook for user logout
 */
export function useLogoutMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (): Promise<void> => {
			await api.post("/auth/logout");
		},
		onSuccess: () => {
			// Clear all queries from cache on logout
			queryClient.clear();
		},
	});
}

/**
 * React Query hook for getting current user data
 */
export function useCurrentUserQuery() {
	return useQuery({
		queryKey: authQueryKeys.currentUser,
		queryFn: async (): Promise<User> => {
			const response = await api.post("/auth/me");
			return response.data;
		},
		refetchOnWindowFocus: false,
		retry: false, // Don't retry on auth failures
	});
}
