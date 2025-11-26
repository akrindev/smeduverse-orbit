"use client";

import { api } from "@/lib/api";
import type {
	MonthlyRecapAllBody,
	MonthlyRecapAllResponse,
	MonthlyRecapBody,
	MonthlyRecapResponse,
	MonthlyStudentRecapBody,
	MonthlyStudentRecapResponse,
} from "@/types/monthly-recap";
import { useMutation } from "@tanstack/react-query";

// Types for export operations
export interface ExportDateRangeBody {
	from: string;
	to?: string;
	status?: string;
	rombel_id?: string;
}

export interface ExportAssignmentBody {
	modulUuid: string;
	// Add other fields as needed
}

/**
 * React Query hook for exporting attendance recap by date range
 */
export function useExportAttendanceByDateRangeMutation() {
	return useMutation({
		mutationFn: async (data: ExportDateRangeBody): Promise<Blob> => {
			const response = await api.post(
				`/modul/presence/recap/export/date-range`,
				data,
				{
					responseType: "blob",
				},
			);
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for exporting today's attendance recap
 */
export function useExportTodayAttendanceMutation() {
	return useMutation({
		mutationFn: async (): Promise<Blob> => {
			const response = await api.get(`/modul/presence/recap/export/today`, {
				responseType: "blob",
			});
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for exporting assignment data
 */
export function useExportAssignmentMutation() {
	return useMutation({
		mutationFn: async (modulUuid: string): Promise<Blob> => {
			const response = await api.get(`/modul/assignment/export/${modulUuid}`, {
				responseType: "blob",
			});
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for exporting teacher journal
 */
export function useExportTeacherJournalMutation() {
	return useMutation({
		mutationFn: async (data: ExportDateRangeBody): Promise<Blob> => {
			const response = await api.post(
				`/modul/presence/recap/export/teacher-journal`,
				data,
				{
					responseType: "blob",
				},
			);
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for exporting class journal
 */
export function useExportClassJournalMutation() {
	return useMutation({
		mutationFn: async (data: ExportDateRangeBody): Promise<Blob> => {
			const response = await api.post(
				`/modul/presence/recap/export/journal`,
				data,
				{
					responseType: "blob",
				},
			);
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for exporting single assignment
 */
export function useExportSingleAssignmentMutation() {
	return useMutation({
		mutationFn: async (assignmentUuid: string): Promise<Blob> => {
			const response = await api.get(
				`/modul/assignment/export/single/${assignmentUuid}`,
				{
					responseType: "blob",
				},
			);
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for fetching monthly presence recap
 */
export function useMonthlyRecapMutation() {
	return useMutation({
		mutationFn: async (
			data: MonthlyRecapBody,
		): Promise<MonthlyRecapResponse> => {
			const response = await api.get(`/modul/presence/recap/monthly`, {
				params: {
					rombel_id: data.rombel_id,
					month: data.month,
					year: data.year,
				},
			});
			return response.data as MonthlyRecapResponse;
		},
	});
}

/**
 * React Query hook for exporting monthly presence recap to XLSX
 */
export function useExportMonthlyRecapMutation() {
	return useMutation({
		mutationFn: async (data: MonthlyRecapBody): Promise<Blob> => {
			const response = await api.get(`/modul/presence/recap/export/monthly`, {
				params: {
					rombel_id: data.rombel_id,
					month: data.month,
					year: data.year,
				},
				responseType: "blob",
			});
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for fetching monthly presence recap for all classes
 */
export function useMonthlyRecapAllMutation() {
	return useMutation({
		mutationFn: async (
			data: MonthlyRecapAllBody,
		): Promise<MonthlyRecapAllResponse> => {
			const response = await api.get(`/modul/presence/recap/monthly-all`, {
				params: {
					month: data.month,
					year: data.year,
				},
			});
			return response.data as MonthlyRecapAllResponse;
		},
	});
}

/**
 * React Query hook for exporting monthly presence recap for all classes to XLSX
 */
export function useExportMonthlyRecapAllMutation() {
	return useMutation({
		mutationFn: async (data: MonthlyRecapAllBody): Promise<Blob> => {
			const response = await api.get(
				`/modul/presence/recap/export/monthly-all`,
				{
					params: {
						month: data.month,
						year: data.year,
					},
					responseType: "blob",
				},
			);
			return response.data as Blob;
		},
	});
}

/**
 * React Query hook for fetching monthly presence recap for individual student
 */
export function useMonthlyStudentRecapMutation() {
	return useMutation({
		mutationFn: async (
			data: MonthlyStudentRecapBody,
		): Promise<MonthlyStudentRecapResponse> => {
			const response = await api.get(`/modul/presence/recap/monthly-student`, {
				params: {
					student_id: data.student_id,
					rombel_id: data.rombel_id,
					month: data.month,
					year: data.year,
				},
			});
			return response.data as MonthlyStudentRecapResponse;
		},
	});
}

/**
 * React Query hook for exporting monthly presence recap for individual student to XLSX
 */
export function useExportMonthlyStudentRecapMutation() {
	return useMutation({
		mutationFn: async (data: MonthlyStudentRecapBody): Promise<Blob> => {
			const response = await api.get(
				`/modul/presence/recap/export/monthly-student`,
				{
					params: {
						student_id: data.student_id,
						rombel_id: data.rombel_id,
						month: data.month,
						year: data.year,
					},
					responseType: "blob",
				},
			);
			return response.data as Blob;
		},
	});
}
