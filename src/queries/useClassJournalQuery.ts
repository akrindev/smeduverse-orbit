"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query keys
export const classJournalQueryKeys = {
	list: (filters: Record<string, unknown>) => ["class-journal", filters],
};

// Types from usePresence store
export interface ClassJournalFilter {
	rombel_id: string;
	from: string;
	to?: string | null;
	page?: number;
}

export interface ClassJournalResponse {
	current_page: number;
	data: any[]; // IAttendance[] | Array<any>
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

// Hook for fetching class journals
export function useClassJournalQuery(filters: ClassJournalFilter | null) {
	const enabled = !!filters && !!filters.rombel_id;
	return useQuery({
		queryKey: classJournalQueryKeys.list(
			(filters as unknown as Record<string, unknown>) || {},
		),
		queryFn: async (): Promise<ClassJournalResponse> => {
			if (!filters) throw new Error("Filters required");

			const params = {
				rombel_id: filters.rombel_id,
				from: filters.from,
				to: filters.to || undefined,
				page: filters.page || 1,
			};

			const response = await api.post("/modul/presence/recap/journal", params);
			return response.data as ClassJournalResponse;
		},
		enabled,
		refetchOnWindowFocus: false,
	});
}
