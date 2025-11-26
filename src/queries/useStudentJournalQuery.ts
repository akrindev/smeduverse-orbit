"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { StudentJournalResponse } from "../store/useStudentJournal";

// Query keys
export const studentJournalQueryKeys = {
	list: (filters: Record<string, unknown>) => ["student-journal", filters],
};

// Types
export interface StudentJournalFilter {
	rombel_id: string;
	from: string;
	to?: string | null;
	page?: number;
}

// Hook for fetching student journals
export function useStudentJournalsQuery(filters: StudentJournalFilter | null) {
	const enabled = !!filters && !!filters.rombel_id;
	return useQuery({
		queryKey: studentJournalQueryKeys.list(
			(filters as unknown as Record<string, unknown>) || {},
		),
		queryFn: async (): Promise<StudentJournalResponse> => {
			if (!filters) throw new Error("Filters required");

			const params = {
				from: filters.from,
				to: filters.to || undefined,
				page: filters.page || 1,
			};

			const response = await api.get(
				`/modul/presence/student-journals/${filters.rombel_id}`,
				{
					params,
				},
			);
			return response.data as StudentJournalResponse;
		},
		enabled,
		refetchOnWindowFocus: false,
	});
}
