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
	weeklyTrend: () => [...apelAttendanceQueryKeys.all, "weeklyTrend"] as const,
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
			const response = await api.get("/attendance/apel/latest", {
				params,
				validateStatus: (status) => status < 500,
			});

			if (response.status === 404) {
				return {
					message: response.data?.message || "Belum ada data kehadiran apel hari ini",
					attendances: {
						data: [],
						current_page: 1,
						last_page: 1,
						per_page: 15,
						total: 0,
					},
				};
			}

			return response.data;
		},
		retry: false,
	});
}

export function useMonthlyApelAttendanceQuery(params: { rombel_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.month(params.rombel_id, params.month, params.year),
		queryFn: async (): Promise<MonthlyApelAttendanceResponse> => {
			const response = await api.get("/attendance/apel/month", {
				params,
				validateStatus: (status) => status < 500,
			});

			if (response.status === 404 || response.status === 204) {
				return {
					message: response.data?.message || "Belum ada data kehadiran apel bulan ini",
					rombel: "",
					bulan: String(params.month || ""),
					tahun: params.year || new Date().getFullYear(),
					attendances: {},
				};
			}

			return response.data;
		},
		enabled: !!params.rombel_id,
		retry: false,
	});
}

export function useStudentApelHistoryQuery(params: { student_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.student(params.student_id, params.month, params.year),
		queryFn: async (): Promise<StudentApelHistoryResponse> => {
			const response = await api.get("/attendance/apel/student", {
				params,
				validateStatus: (status) => status < 500,
			});

			if (response.status === 404 || response.status === 204 || !response.data) {
				return {
					message: response.data?.message || "Belum ada data kehadiran apel bulan ini",
					attendances: [],
				};
			}

			return response.data;
		},
		enabled: !!params.student_id,
		retry: false,
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
			const response = await api.get("/attendance/setting/get", {
				params: { key },
				validateStatus: (status) => status < 500,
			});

			if (response.status === 422 || response.status === 404) {
				return {
					id: 0,
					key,
					value: "07:00",
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				};
			}

			return response.data;
		},
		enabled: !!key,
		retry: false,
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

export function useWeeklyApelTrendQuery() {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.weeklyTrend(),
		queryFn: async (): Promise<{ message: string; trend: { day: string; hadir: number; terlambat: number }[] }> => {
			const response = await api.get("/attendance/apel/weekly-trend", {
				validateStatus: (status) => status < 500,
			});

			if (response.status >= 400 || !response.data?.trend) {
				return {
					message: "Tren mingguan",
					trend: [
						{ day: "Senin", hadir: 0, terlambat: 0 },
						{ day: "Selasa", hadir: 0, terlambat: 0 },
						{ day: "Rabu", hadir: 0, terlambat: 0 },
						{ day: "Kamis", hadir: 0, terlambat: 0 },
						{ day: "Jumat", hadir: 0, terlambat: 0 },
					],
				};
			}

			return response.data;
		},
		retry: false,
	});
}
