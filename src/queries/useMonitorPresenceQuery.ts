"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ActivePresenceMonitor } from "@/types/monitor";

// Query keys for monitoring presence
export const monitorQueryKeys = {
  activePresences: ["activePresences"],
};

/**
 * Fetches active presence data from the API
 * @returns Promise with the active presence monitor data
 */
const fetchActivePresence = async (): Promise<ActivePresenceMonitor> => {
  try {
    const { data } = await api.get("/modul/presence/monitor/active");
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Active presence data not found");
    }
    throw error;
  }
};

/**
 * React Query hook for monitoring active presences
 * @param refreshInterval - Interval in milliseconds to refresh data (default: 10000)
 */
export function useMonitorPresenceQuery(refreshInterval: number = 10000) {
  // Query for active presences with automatic refresh
  const activePresencesQuery = useQuery({
    queryKey: monitorQueryKeys.activePresences,
    queryFn: fetchActivePresence,
    refetchInterval: refreshInterval, // Refetch at the specified interval
    refetchOnWindowFocus: true, // Also refetch when the window regains focus
  });

  return {
    activePresencesQuery,
  };
}
