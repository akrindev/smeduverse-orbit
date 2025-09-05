"use client";

import { api } from "@/lib/api";
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
