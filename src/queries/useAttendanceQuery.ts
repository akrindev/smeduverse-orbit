"use client";

import { api } from "@/lib/api";
import type { Attendance } from "@/types/attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for attendance-related queries
export const attendanceQueryKeys = {
	attendanceRecap: (modulUuid: string) => ["attendance-recap", modulUuid],
	attendanceRecapByDateRange: ["attendance-recap-date-range"],
};

// Type for updating attendance status
export interface UpdateAttendanceStatusBody {
	attendance: Attendance;
	status: string;
}

// Type for updating attendance notes
export interface UpdateAttendanceNotesBody {
	attendance: Attendance;
	notes: string;
}

// Type for date range recap
export interface DateRangeRecapBody {
	from: string;
	to?: string;
	status?: string;
	rombel_id?: string;
}

/**
 * React Query hook for updating attendance status
 */
export function useUpdateAttendanceStatusMutation(presenceUuid: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateAttendanceStatusBody) => {
			const data = { ...payload.attendance, status: payload.status };
			return await api.patch(
				`/modul/presence/patch-attendance/${presenceUuid}`,
				data,
			);
		},
		onSuccess: () => {
			// Invalidate presence query to refresh attendance data
			queryClient.invalidateQueries({
				queryKey: ["presence", presenceUuid],
			});
		},
	});
}

/**
 * React Query hook for updating attendance notes
 */
export function useUpdateAttendanceNotesMutation(presenceUuid: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateAttendanceNotesBody) => {
			const data = { ...payload.attendance, notes: payload.notes };
			return await api.patch(
				`/modul/presence/patch-attendance/${presenceUuid}/notes`,
				data,
			);
		},
		onSuccess: () => {
			// Invalidate presence query to refresh attendance data
			queryClient.invalidateQueries({
				queryKey: ["presence", presenceUuid],
			});
		},
	});
}

/**
 * React Query hook for getting attendance recap for a module
 */
export function useAttendanceRecapQuery(modulUuid: string) {
	return useQuery({
		queryKey: attendanceQueryKeys.attendanceRecap(modulUuid),
		queryFn: async (): Promise<Attendance[]> => {
			try {
				const response = await api.get(`/modul/presence/recap/${modulUuid}`);
				const payload = response.data;
				const list = Array.isArray(payload)
					? (payload as Attendance[])
					: Array.isArray(payload?.data)
						? (payload.data as Attendance[])
						: [];
				return list;
			} catch (error: any) {
				if (error.response?.status === 404) {
					throw new Error("Module not found");
				}
				throw error;
			}
		},
		refetchOnWindowFocus: false,
		enabled: !!modulUuid,
	});
}

/**
 * React Query hook for getting attendance recap by date range
 */
export function useAttendanceRecapByDateRangeQuery() {
	return useMutation({
		mutationFn: async (data: DateRangeRecapBody): Promise<any> => {
			const response = await api.post(`/modul/presence/recap/date-range`, data);
			return response.data;
		},
	});
}
