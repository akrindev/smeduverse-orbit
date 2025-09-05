"use client";

import { api } from "@/lib/api";
import type { Rombel } from "@/types/modul";
import { useQuery } from "@tanstack/react-query";

// Query keys for rombel-related queries
export const rombelQueryKeys = {
	rombels: ["rombels"],
};

/**
 * React Query hook for fetching all class groups (rombels)
 */
export function useRombelsQuery() {
	return useQuery({
		queryKey: rombelQueryKeys.rombels,
		queryFn: async (): Promise<Rombel[]> => {
			const response = await api.get("/rombel/list");
			return response.data;
		},
		refetchOnWindowFocus: false,
	});
}
