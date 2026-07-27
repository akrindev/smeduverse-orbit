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
			const response = await api.get("/attendance/apel/latest", { params });
			return response.data;
		},
	});
}

export function useMonthlyApelAttendanceQuery(params: { rombel_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.month(params.rombel_id, params.month, params.year),
		queryFn: async (): Promise<MonthlyApelAttendanceResponse> => {
			const response = await api.get("/attendance/apel/month", { params });
			return response.data;
		},
		enabled: !!params.rombel_id,
	});
}

export function useStudentApelHistoryQuery(params: { student_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.student(params.student_id, params.month, params.year),
		queryFn: async (): Promise<StudentApelHistoryResponse> => {
			const response = await api.get("/attendance/apel/student", { params });
			return response.data;
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
			const response = await api.get("/attendance/setting/get", { params: { key } });
			return response.data;
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
