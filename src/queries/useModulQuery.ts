"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Query keys for module-related queries
export const modulQueryKeys = {
  modulInfo: (uuid: string) => ["modul", "info", uuid],
};

// Type for modul data response
export type ModulInfo = {
  mapel: {
    nama: string;
    // Add other fields as needed
  };
  teacher: {
    teacher_id: string;
    fullname: string;
    // Add other fields as needed
  };
  rombel: {
    nama: string;
    // Add other fields as needed
  };
  // Add other fields as needed
};

/**
 * React Query hook for fetching module information
 * @param uuid - The UUID of the module to fetch
 */
export function useModulQuery(uuid: string) {
  // Query for getting module information
  const modulInfoQuery = useQuery({
    queryKey: modulQueryKeys.modulInfo(uuid),
    queryFn: async (): Promise<ModulInfo> => {
      try {
        // Use axios api client which automatically adds the auth token header
        const response = await api.get(`/modul/show/${uuid}`);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          throw new Error("Module not found");
        }
        throw error;
      }
    },
    // Don't automatically refetch on focus/reconnect for better performance
    refetchOnWindowFocus: false,
  });

  return {
    modulInfoQuery,
  };
}
