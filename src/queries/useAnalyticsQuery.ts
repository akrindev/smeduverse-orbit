"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query keys for analytics queries
export const analyticsQueryKeys = {
	analytics: ["analytics"],
};

// Types for analytics data
export interface Analytics {
	totalUsers: number;
	totalModules: number;
	// Add other analytics properties as needed
}

/**
 * React Query hook for fetching analytics data
 */
export function useAnalyticsQuery() {
	return useQuery({
		queryKey: analyticsQueryKeys.analytics,
		queryFn: async (): Promise<Analytics[]> => {
			const response = await api.get<Analytics[]>("/analytics");
			return response.data;
		},
		refetchOnWindowFocus: false,
		refetchInterval: 300000, // Refetch every 5 minutes
	});
}
