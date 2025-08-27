import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	Assignment,
	CreateAssignmentBody,
	UpdateAssignmentBody,
} from "@/store/useAssignment";

type AssignmentPagination = {
	data?: Assignment[];
	current_page?: number;
	last_page?: number;
	per_page?: number;
	total?: number;
	[key: string]: unknown;
};

export function useAssignmentsQuery(modulUuid: string) {
	return useQuery({
		queryKey: ["assignments", modulUuid],
		queryFn: async (): Promise<{ list: Assignment[]; raw: unknown }> => {
			const response = await api.get<Assignment[] | AssignmentPagination>(
				`/modul/assignment/${modulUuid}`,
			);
			const payload = response.data;
			const list = Array.isArray(payload)
				? payload
				: Array.isArray(payload?.data)
					? (payload.data as Assignment[])
					: [];
			return { list, raw: payload };
		},
		refetchOnWindowFocus: false,
	});
}

export function useCreateAssignmentMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (body: CreateAssignmentBody) => {
			return api.post(`/modul/assignment/store`, body);
		},
		onSuccess: (_data, variables) => {
			if (variables?.orbit_modul_uuid) {
				queryClient.invalidateQueries({
					queryKey: ["assignments", variables.orbit_modul_uuid],
				});
			}
		},
	});
}

export function useDeleteAssignmentMutation() {
	return useMutation({
		mutationFn: async (assignmentUuid: string) => {
			return api.delete(`/modul/assignment/destroy/${assignmentUuid}`);
		},
		onSuccess: () => {},
	});
}

export function useAssignmentShowQuery(assignmentUuid: string) {
	return useQuery({
		queryKey: ["assignment", assignmentUuid],
		queryFn: async (): Promise<Assignment> => {
			const response = await api.get<unknown>(
				`/modul/assignment/show/${assignmentUuid}`,
			);
			const raw = response.data as any;
			const normalizedSheets = Array.isArray(raw?.assignment_sheet)
				? (raw.assignment_sheet as any[]).map((s) => ({
						uuid: s?.uuid,
						student_id: s?.student_id,
						student_name: s?.student?.fullname ?? undefined,
						student_nis: s?.student?.nipd ?? undefined,
						grade: s?.grade ?? null,
						notes: s?.notes ?? null,
					}))
				: [];

			return {
				...(raw || {}),
				sheets: normalizedSheets,
			} as Assignment;
		},
		refetchOnWindowFocus: false,
		enabled: !!assignmentUuid,
	});
}

export function usePatchAssignmentGradeMutation(assignmentUuid: string) {
	return useMutation({
		mutationFn: async (payload: {
			student_id: string;
			grade: number | null;
		}) => {
			return api.patch(
				`/modul/assignment/patch-sheet/${assignmentUuid}/grade`,
				payload,
			);
		},
	});
}

export function usePatchAssignmentNotesMutation(assignmentUuid: string) {
	return useMutation({
		mutationFn: async (payload: {
			student_id: string;
			notes: string | null;
		}) => {
			return api.patch(
				`/modul/assignment/patch-sheet/${assignmentUuid}/notes`,
				payload,
			);
		},
	});
}

export function useUpdateAssignmentMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			assignmentUuid,
			body,
		}: {
			assignmentUuid: string;
			body: UpdateAssignmentBody;
		}) => {
			return api.put(`/modul/assignment/update/${assignmentUuid}`, body);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["assignment"] });
			queryClient.invalidateQueries({ queryKey: ["assignments"] });
		},
	});
}

export function useAssignmentRecapQuery(modulUuid: string) {
	return useQuery({
		queryKey: ["assignment-recap", modulUuid],
		queryFn: async (): Promise<any> => {
			const response = await api.get(`/modul/assignment/recap/${modulUuid}`);
			return response.data;
		},
		refetchOnWindowFocus: false,
		enabled: !!modulUuid,
	});
}
