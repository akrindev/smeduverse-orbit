"use client";

import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface SubjectSchedule {
	id: number;
	subject_key: number;
	start_time: string;
	end_time: string;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}

export interface CreateSubjectScheduleBody {
	subject_key: number;
	start_time: string;
	end_time: string;
}

export interface UpdateSubjectScheduleBody {
	subject_key?: number;
	start_time?: string;
	end_time?: string;
}

// Query keys for subject schedule queries
export const subjectScheduleQueryKeys = {
	schedules: ["subject-schedules"],
	schedule: (id: number) => ["subject-schedule", id],
};

/**
 * React Query hook for fetching all subject schedules
 */
export function useSubjectSchedulesQuery() {
	return useQuery({
		queryKey: subjectScheduleQueryKeys.schedules,
		queryFn: async (): Promise<SubjectSchedule[]> => {
			const response = await api.get("/subject-schedule/list");
			if (response.data.success) {
				return response.data.data;
			}
			throw new Error("Failed to fetch schedules");
		},
		refetchOnWindowFocus: false,
	});
}

/**
 * React Query hook for creating a new subject schedule
 */
export function useCreateSubjectScheduleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			body: CreateSubjectScheduleBody,
		): Promise<SubjectSchedule> => {
			const response = await api.post("/subject-schedule/store", body);
			if (response.data.success) {
				return response.data.data;
			}
			throw new Error("Failed to create schedule");
		},
		onSuccess: () => {
			// Invalidate and refetch schedules list
			queryClient.invalidateQueries({
				queryKey: subjectScheduleQueryKeys.schedules,
			});
		},
	});
}

/**
 * React Query hook for updating an existing subject schedule
 */
export function useUpdateSubjectScheduleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			body,
		}: {
			id: number;
			body: UpdateSubjectScheduleBody;
		}): Promise<SubjectSchedule> => {
			const response = await api.put(`/subject-schedule/update/${id}`, body);
			if (response.data.success) {
				return response.data.data;
			}
			throw new Error("Failed to update schedule");
		},
		onSuccess: (data, variables) => {
			// Invalidate and refetch schedules list
			queryClient.invalidateQueries({
				queryKey: subjectScheduleQueryKeys.schedules,
			});
			// Update specific schedule in cache
			queryClient.setQueryData(
				subjectScheduleQueryKeys.schedule(variables.id),
				data,
			);
		},
	});
}

/**
 * React Query hook for deleting a subject schedule
 */
export function useDeleteSubjectScheduleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number): Promise<void> => {
			const response = await api.delete(`/subject-schedule/delete/${id}`);
			if (!response.data.success) {
				throw new Error("Failed to delete schedule");
			}
		},
		onSuccess: (_, id) => {
			// Invalidate and refetch schedules list
			queryClient.invalidateQueries({
				queryKey: subjectScheduleQueryKeys.schedules,
			});
			// Remove specific schedule from cache
			queryClient.removeQueries({
				queryKey: subjectScheduleQueryKeys.schedule(id),
			});
		},
	});
}
