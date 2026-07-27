"use client";

import { api } from "@/lib/api";
import type {
	LatestApelAttendanceResponse,
	MonthlyApelAttendanceResponse,
	OrbitSetting,
	StoreApelAttendancePayload,
	StoreApelAttendanceResponse,
	StudentApelHistoryResponse,
	UpdateOrbitSettingPayload,
} from "@/types/apel-attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const apelAttendanceQueryKeys = {
	all: ["apel-attendance"] as const,
	latest: (date?: string, rombelId?: string, page?: number) =>
		[...apelAttendanceQueryKeys.all, "latest", date, rombelId, page] as const,
	month: (rombelId: string, month?: number, year?: number) =>
		[...apelAttendanceQueryKeys.all, "month", rombelId, month, year] as const,
	student: (studentId: string, month?: number, year?: number) =>
		[...apelAttendanceQueryKeys.all, "student", studentId, month, year] as const,
	setting: (key: string) => [...apelAttendanceQueryKeys.all, "setting", key] as const,
};

export function useStoreApelAttendanceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: StoreApelAttendancePayload): Promise<StoreApelAttendanceResponse> => {
			const response = await api.post("/attendance/apel/store", payload);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: apelAttendanceQueryKeys.all });
		},
	});
}

export function useLatestApelAttendanceQuery(params?: { date?: string; rombel_id?: string; page?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.latest(params?.date, params?.rombel_id, params?.page),
		queryFn: async (): Promise<LatestApelAttendanceResponse> => {
			try {
				const response = await api.get("/attendance/apel/latest", { params });
				return response.data;
			} catch (error: any) {
				if (error.response?.status === 404) {
					return {
						message: error.response?.data?.message || "Belum ada data kehadiran apel hari ini",
						attendances: {
							data: [],
							current_page: 1,
							last_page: 1,
							per_page: 15,
							total: 0,
						},
					};
				}
				throw error;
			}
		},
	});
}

export function useMonthlyApelAttendanceQuery(params: { rombel_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.month(params.rombel_id, params.month, params.year),
		queryFn: async (): Promise<MonthlyApelAttendanceResponse> => {
			try {
				const response = await api.get("/attendance/apel/month", { params });
				return response.data;
			} catch (error: any) {
				if (error.response?.status === 404 || error.response?.status === 204) {
					return {
						message: "Belum ada data kehadiran apel bulan ini",
						rombel: "",
						bulan: String(params.month || ""),
						tahun: params.year || new Date().getFullYear(),
						attendances: {},
					};
				}
				throw error;
			}
		},
		enabled: !!params.rombel_id,
	});
}

export function useStudentApelHistoryQuery(params: { student_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.student(params.student_id, params.month, params.year),
		queryFn: async (): Promise<StudentApelHistoryResponse> => {
			try {
				const response = await api.get("/attendance/apel/student", { params });
				if (response.status === 204 || !response.data) {
					return { message: "Belum ada data kehadiran apel bulan ini", attendances: [] };
				}
				return response.data;
			} catch (error: any) {
				if (error.response?.status === 404 || error.response?.status === 204) {
					return { message: "Belum ada data kehadiran apel bulan ini", attendances: [] };
				}
				throw error;
			}
		},
		enabled: !!params.student_id,
	});
}

export function useDeleteApelAttendanceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			const response = await api.delete(`/attendance/apel/delete/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: apelAttendanceQueryKeys.all });
		},
	});
}

export function useOrbitSettingQuery(key: string) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.setting(key),
		queryFn: async (): Promise<OrbitSetting> => {
			try {
				const response = await api.get("/attendance/setting/get", { params: { key } });
				return response.data;
			} catch (error: any) {
				// Handle 422 (invalid/uncreated key) or 404 gracefully with default fallback
				if (error.response?.status === 422 || error.response?.status === 404) {
					return {
						id: 0,
						key,
						value: "07:00",
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString(),
					};
				}
				throw error;
			}
		},
		enabled: !!key,
	});
}

export function useUpdateOrbitSettingMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: UpdateOrbitSettingPayload): Promise<{ message: string; setting: OrbitSetting }> => {
			const response = await api.put("/attendance/setting/update", payload);
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: apelAttendanceQueryKeys.setting(variables.key) });
		},
	});
}
