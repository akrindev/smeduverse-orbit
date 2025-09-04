"use client";

import { api } from "@/lib/api";
import type { Presence } from "@/types/presence";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for presence-related queries
export const presenceQueryKeys = {
	presences: (modulUuid: string) => ["presences", modulUuid],
	presence: (presenceUuid: string) => ["presence", presenceUuid],
};

// Type for creating presence
export interface CreatePresenceBody {
	orbit_modul_uuid: string;
	title: string;
	description: string;
	date: string;
}

// Type for updating presence
export interface UpdatePresenceBody {
	presence_uuid: string;
	title?: string;
	description?: string;
	date?: string;
}

/**
 * React Query hook for fetching all presences for a module
 */
export function usePresencesQuery(modulUuid: string) {
	return useQuery({
		queryKey: presenceQueryKeys.presences(modulUuid),
		queryFn: async (): Promise<Presence[]> => {
			try {
				const response = await api.get(`/modul/presence/${modulUuid}`);
				return response.data;
			} catch (error: any) {
				if (error.response?.status === 404) {
					throw new Error("Module not found");
				}
				throw error;
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!modulUuid,
	});
}

/**
 * React Query hook for fetching a specific presence
 */
export function usePresenceQuery(presenceUuid: string) {
	return useQuery({
		queryKey: presenceQueryKeys.presence(presenceUuid),
		queryFn: async (): Promise<Presence> => {
			try {
				const response = await api.get(`/modul/presence/show/${presenceUuid}`);
				return response.data;
			} catch (error: any) {
				if (error.response?.status === 404) {
					throw new Error("Presence not found");
				}
				throw error;
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!presenceUuid,
	});
}

/**
 * React Query hook for creating a new presence
 */
export function useCreatePresenceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: CreatePresenceBody): Promise<any> => {
			const response = await api.post(`/modul/presence/store`, body);
			return response.data;
		},
		onSuccess: (data, variables) => {
			// Invalidate and refetch presences list for the module
			queryClient.invalidateQueries({
				queryKey: presenceQueryKeys.presences(variables.orbit_modul_uuid),
			});
		},
	});
}

/**
 * React Query hook for updating an existing presence
 */
export function useUpdatePresenceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: UpdatePresenceBody): Promise<any> => {
			const response = await api.put(
				`/modul/presence/update/${body.presence_uuid}`,
				body,
			);
			return response.data;
		},
		onSuccess: (data, variables) => {
			// Invalidate and refetch specific presence
			queryClient.invalidateQueries({
				queryKey: presenceQueryKeys.presence(variables.presence_uuid),
			});
			// Also invalidate presences list if we have the module UUID
			if (data?.orbit_modul_uuid) {
				queryClient.invalidateQueries({
					queryKey: presenceQueryKeys.presences(data.orbit_modul_uuid),
				});
			}
		},
	});
}

/**
 * React Query hook for deleting a presence
 */
export function useDeletePresenceMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (presenceUuid: string): Promise<any> => {
			const response = await api.delete(
				`/modul/presence/destroy/${presenceUuid}`,
			);
			return response.data;
		},
		onSuccess: (data, presenceUuid) => {
			// Remove specific presence from cache
			queryClient.removeQueries({
				queryKey: presenceQueryKeys.presence(presenceUuid),
			});
			// Invalidate presences list if we have the module UUID
			if (data?.orbit_modul_uuid) {
				queryClient.invalidateQueries({
					queryKey: presenceQueryKeys.presences(data.orbit_modul_uuid),
				});
			}
		},
	});
}
