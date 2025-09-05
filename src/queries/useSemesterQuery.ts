"use client";

import { api } from "@/lib/api";
import type { Semester } from "@/types/semester";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for semester-related queries
export const semesterQueryKeys = {
	semesters: ["semesters"],
	semester: (id: number | string) => ["semester", id],
};

// Types for semester operations
export interface CreateSemesterBody {
	name: string;
	is_active: boolean | number;
}

export interface UpdateSemesterBody {
	name?: string;
	is_active?: boolean | number;
}

/**
 * React Query hook for fetching all semesters
 */
export function useSemestersQuery() {
	return useQuery({
		queryKey: semesterQueryKeys.semesters,
		queryFn: async (): Promise<Semester[]> => {
			const response = await api.get<Semester[]>("/semester/list");
			return response.data;
		},
		refetchOnWindowFocus: false,
	});
}

/**
 * React Query hook for creating a new semester
 */
export function useCreateSemesterMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (body: CreateSemesterBody): Promise<Semester> => {
			const response = await api.post("/semester/store", body);
			return response.data;
		},
		onSuccess: () => {
			// Invalidate and refetch semesters list
			queryClient.invalidateQueries({
				queryKey: semesterQueryKeys.semesters,
			});
		},
	});
}

/**
 * React Query hook for updating an existing semester
 */
export function useUpdateSemesterMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: number | string;
			body: UpdateSemesterBody;
		}): Promise<Semester> => {
			const response = await api.put(`/semester/update/${id}`, body);
			return response.data;
		},
		onSuccess: (data, variables) => {
			// Invalidate and refetch semesters list
			queryClient.invalidateQueries({
				queryKey: semesterQueryKeys.semesters,
			});
			// Update specific semester in cache
			queryClient.setQueryData(semesterQueryKeys.semester(variables.id), data);
		},
	});
}

/**
 * React Query hook for deleting a semester
 */
export function useDeleteSemesterMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number | string): Promise<void> => {
			const response = await api.delete(`/semester/destroy/${id}`);
			if (response.data.error) {
				throw new Error(response.data.message || "Failed to delete semester");
			}
		},
		onSuccess: (_, id) => {
			// Invalidate and refetch semesters list
			queryClient.invalidateQueries({
				queryKey: semesterQueryKeys.semesters,
			});
			// Remove specific semester from cache
			queryClient.removeQueries({
				queryKey: semesterQueryKeys.semester(id),
			});
		},
	});
}
