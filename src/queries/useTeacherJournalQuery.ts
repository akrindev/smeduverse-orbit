"use client";

import { api } from "@/lib/api";
import type { TeacherJournalResponse } from "@/store/useTeacherJournal";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const teacherJournalQueryKeys = {
	list: (filters: Record<string, unknown>) => ["teacher-journal", filters],
};

// Types
export interface TeacherJournalFilter {
	teacher_id: string;
	from: string;
	to?: string | null;
	page?: number;
}

// Hook for fetching teacher journals
export function useTeacherJournalsQuery(filters: TeacherJournalFilter | null) {
	const enabled = !!filters && !!filters.teacher_id;
	return useQuery({
		queryKey: teacherJournalQueryKeys.list(
			(filters as unknown as Record<string, unknown>) || {},
		),
		queryFn: async (): Promise<TeacherJournalResponse> => {
			if (!filters) throw new Error("Filters required");

			const params = {
				teacher_id: filters.teacher_id,
				from: filters.from,
				to: filters.to || undefined,
				page: filters.page || 1,
			};

			const response = await api.get("/modul/presence/recap/teacher-journal", {
				params,
			});
			return response.data as TeacherJournalResponse;
		},
		enabled,
		refetchOnWindowFocus: false,
	});
}
