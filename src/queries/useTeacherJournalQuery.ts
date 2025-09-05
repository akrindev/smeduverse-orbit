"use client";

import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// Query keys for teacher journal queries
export const teacherJournalQueryKeys = {
	teacherJournals: (filters: TeacherJournalFilter) => [
		"teacher-journals",
		filters,
	],
};

// Types for teacher journal
export interface TeacherJournalEntry {
	uuid: string;
	orbit_modul_uuid: string;
	title: string;
	description: string;
	date: string;
	start_time: string;
	end_time: string;
	subject_schedule_id: number;
	subject_schedule_end_id: number;
	created_at: string;
	updated_at: string;
	count_h: number;
	count_s: number;
	count_i: number;
	count_a: number;
	count_b: number;
	modul: {
		uuid: string;
		rombongan_belajar_id: string;
		mapel_id: number;
		teacher_id: string;
		rombel: {
			id: string;
			nama: string;
		};
		mapel: {
			id: number;
			nama: string;
			kode?: string;
		};
		teacher: {
			teacher_id: string;
			fullname: string;
			niy: string;
		};
	};
	schedule: {
		id: number;
		subject_key: number;
		start_time: string;
		end_time: string;
		created_at: string;
		updated_at: string;
		deleted_at: null | string;
	};
}

export interface TeacherJournalResponse {
	current_page: number;
	data: TeacherJournalEntry[];
	first_page_url: string;
	from: number;
	last_page: number;
	last_page_url: string;
	links: Array<{
		url: string | null;
		label: string;
		active: boolean;
	}>;
	next_page_url: string | null;
	path: string;
	per_page: number;
	prev_page_url: string | null;
	to: number;
	total: number;
}

export interface TeacherJournalFilter {
	teacher_id: string;
	from: Date;
	to?: Date | null;
	page?: number;
}

/**
 * React Query hook for fetching teacher journals with filters
 */
export function useTeacherJournalsQuery(filters: TeacherJournalFilter) {
	return useQuery({
		queryKey: teacherJournalQueryKeys.teacherJournals(filters),
		queryFn: async (): Promise<TeacherJournalResponse> => {
			const { teacher_id, from, to, page = 1 } = filters;

			// Format dates to YYYY-MM-DD
			const formattedFrom = format(from, "yyyy-MM-dd");
			const formattedTo = to ? format(to, "yyyy-MM-dd") : null;

			try {
				// Using GET with query parameters instead of POST with request body
				const response = await api.get(
					"/modul/presence/recap/teacher-journal",
					{
						params: {
							teacher_id,
							from: formattedFrom,
							to: formattedTo,
							page,
						},
					},
				);

				return response.data;
			} catch (error: any) {
				if (error.response?.status === 404) {
					throw new Error("Teacher journals not found");
				}
				throw error;
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!filters.teacher_id,
	});
}

/**
 * React Query hook for fetching teacher journals (mutation for date range changes)
 */
export function useTeacherJournalsMutation() {
	return useMutation({
		mutationFn: async (
			filters: TeacherJournalFilter,
		): Promise<TeacherJournalResponse> => {
			const { teacher_id, from, to, page = 1 } = filters;

			// Format dates to YYYY-MM-DD
			const formattedFrom = format(from, "yyyy-MM-dd");
			const formattedTo = to ? format(to, "yyyy-MM-dd") : null;

			const response = await api.get("/modul/presence/recap/teacher-journal", {
				params: {
					teacher_id,
					from: formattedFrom,
					to: formattedTo,
					page,
				},
			});

			return response.data;
		},
	});
}
