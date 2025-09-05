"use client";

import { api } from "@/lib/api";
import type { Modul } from "@/types/modul";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for module-related queries
export const modulQueryKeys = {
	modulInfo: (uuid: string) => ["modul", "info", uuid],
	list: (query?: Record<string, string | null | undefined>) => [
		"modul",
		"list",
		query ? JSON.stringify(query) : "all",
	],
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

// Query for module list
export type ModulListItem = Modul;

export type ModulListQuery =
	| {
			teacher_id?: string | null;
			rombel_id?: string | null;
			mapel_id?: string | null;
			semester_id?: string | null;
	  }
	| null
	| undefined;

export function useModulsQuery(query?: ModulListQuery) {
	const params = query || undefined;
	const buildSearch = (q?: ModulListQuery): string => {
		if (!q) return "";
		const entries = Object.entries(q).filter(([, v]) => v != null && v !== "");
		const casted: Record<string, string> = {};
		for (const [k, v] of entries) {
			casted[k] = String(v);
		}
		const usp = new URLSearchParams(casted);
		return usp.toString();
	};
	return useQuery({
		queryKey: modulQueryKeys.list(
			params as Record<string, string | null | undefined> | undefined,
		),
		queryFn: async (): Promise<ModulListItem[]> => {
			const search = buildSearch(params);
			const url = `/modul/list${search ? `?${search}` : ""}`;
			const res = await api.get(url);
			return res.data as ModulListItem[];
		},
		refetchOnWindowFocus: false,
	});
}

export function useOwnedModulsQuery(teacherId?: string | null) {
	const query = teacherId ? { teacher_id: teacherId } : undefined;
	return useModulsQuery(query);
}

// Mutations
export function useCreateModulMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const res = await api.post("/modul/store", body);
			return res.data;
		},
		onSuccess: () => {
			// Invalidate all modul list queries
			queryClient.invalidateQueries({ queryKey: ["modul", "list"] });
		},
	});
}

export function useDeleteModulMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (uuid: string) => {
			const res = await api.delete(`/modul/destroy/${uuid}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["modul", "list"] });
		},
	});
}

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
			} catch (error) {
				const err = error as { response?: { status?: number } };
				if (err.response?.status === 404) {
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
