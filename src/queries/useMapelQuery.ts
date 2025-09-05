"use client";

import { api } from "@/lib/api";
import type { Mapel } from "@/types/modul";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for mapel-related queries
export const mapelQueryKeys = {
	mapels: ["mapels"],
	mapel: (id: number) => ["mapel", id],
};

// Types for mapel operations
export interface CreateMapelBody {
	nama: string;
	kode?: string;
	// Add other fields as needed
}

export interface UpdateMapelBody {
	nama?: string;
	kode?: string;
	// Add other fields as needed
}

/**
 * React Query hook for fetching all subjects (mapel)
 */
export function useMapelsQuery() {
	return useQuery({
		queryKey: mapelQueryKeys.mapels,
		queryFn: async (): Promise<Mapel[]> => {
			const response = await api.get("/mapel/list");
			return response.data;
		},
		refetchOnWindowFocus: false,
	});
}

/**
 * React Query hook for creating a new subject
 */
export function useCreateMapelMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: CreateMapelBody): Promise<Mapel> => {
			const response = await api.post("/mapel/store", body);
			return response.data;
		},
		onSuccess: () => {
			// Invalidate and refetch mapels list
			queryClient.invalidateQueries({
				queryKey: mapelQueryKeys.mapels,
			});
		},
	});
}

/**
 * React Query hook for updating an existing subject
 */
export function useUpdateMapelMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: number;
			body: UpdateMapelBody;
		}): Promise<Mapel> => {
			const response = await api.put(`/mapel/update/${id}`, body);
			return response.data;
		},
		onSuccess: (data, variables) => {
			// Invalidate and refetch mapels list
			queryClient.invalidateQueries({
				queryKey: mapelQueryKeys.mapels,
			});
			// Update specific mapel in cache
			queryClient.setQueryData(mapelQueryKeys.mapel(variables.id), data);
		},
	});
}

/**
 * React Query hook for deleting a subject
 */
export function useDeleteMapelMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number): Promise<void> => {
			const response = await api.delete(`/mapel/destroy/${id}`);
			if (!response.data.success) {
				throw new Error("Failed to delete subject");
			}
		},
		onSuccess: (_, id) => {
			// Invalidate and refetch mapels list
			queryClient.invalidateQueries({
				queryKey: mapelQueryKeys.mapels,
			});
			// Remove specific mapel from cache
			queryClient.removeQueries({
				queryKey: mapelQueryKeys.mapel(id),
			});
		},
	});
}
