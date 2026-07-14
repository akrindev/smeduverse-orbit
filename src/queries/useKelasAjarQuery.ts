"use client";

import { api } from "@/lib/api";
import type { KelasAjar } from "@/types/modul";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for kelas ajar related queries
export const kelasAjarQueryKeys = {
	kelasAjarInfo: (uuid: string) => ["kelas-ajar", "info", uuid],
	list: (query?: Record<string, string | null | undefined>) => [
		"kelas-ajar",
		"list",
		query ? JSON.stringify(query) : "all",
	],
};

// Type for kelas ajar data response
export type KelasAjarInfo = {
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

// Query for kelas ajar list
export type KelasAjarListItem = KelasAjar;

export type KelasAjarListQuery =
	| {
			teacher_id?: string | null;
			rombel_id?: string | null;
			mapel_id?: string | null;
			semester_id?: string | null;
	  }
	| null
	| undefined;

export function useKelasAjarsQuery(query?: KelasAjarListQuery) {
	const params = query || undefined;
	const buildSearch = (q?: KelasAjarListQuery): string => {
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
		queryKey: kelasAjarQueryKeys.list(
			params as Record<string, string | null | undefined> | undefined,
		),
		queryFn: async (): Promise<KelasAjarListItem[]> => {
			const search = buildSearch(params);
			const url = `/modul/list${search ? `?${search}` : ""}`;
			const res = await api.get(url);
			return res.data as KelasAjarListItem[];
		},
		refetchOnWindowFocus: false,
	});
}

export function useOwnedKelasAjarsQuery(teacherId?: string | null) {
	const query = teacherId ? { teacher_id: teacherId } : undefined;
	return useKelasAjarsQuery(query);
}

// Mutations
export function useCreateKelasAjarMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (body: Record<string, unknown>) => {
			const res = await api.post("/modul/store", body);
			return res.data;
		},
		onSuccess: () => {
			// Invalidate all kelas ajar list queries
			queryClient.invalidateQueries({ queryKey: ["kelas-ajar", "list"] });
		},
	});
}

export function useDeleteKelasAjarMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (uuid: string) => {
			const res = await api.delete(`/modul/destroy/${uuid}`);
			return res.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["kelas-ajar", "list"] });
		},
	});
}

/**
 * React Query hook for fetching kelas ajar information
 * @param uuid - The UUID of the kelas ajar to fetch
 */
export function useKelasAjarQuery(uuid: string) {
	// Query for getting kelas ajar information
	const kelasAjarInfoQuery = useQuery({
		queryKey: kelasAjarQueryKeys.kelasAjarInfo(uuid),
		queryFn: async (): Promise<KelasAjarInfo> => {
			try {
				// Use axios api client which automatically adds the auth token header
				const response = await api.get(`/modul/show/${uuid}`);
				return response.data;
			} catch (error) {
				const err = error as { response?: { status?: number } };
				if (err.response?.status === 404) {
					throw new Error("Kelas ajar not found");
				}
				throw error;
			}
		},
		// Don't automatically refetch on focus/reconnect for better performance
		refetchOnWindowFocus: false,
	});

	return {
		kelasAjarInfoQuery,
	};
}
