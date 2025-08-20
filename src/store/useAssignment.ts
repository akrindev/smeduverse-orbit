import type { AxiosResponse } from "axios";
import { create } from "zustand";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export interface AssignmentSheet {
	uuid?: string;
	student_id?: string | number;
	student_uuid?: string;
	student_name?: string;
	student_nis?: string;
	grade?: number | string | null;
	notes?: string | null;
	// Allow additional backend-provided fields without breaking the UI
	[key: string]: unknown;
}

export interface Assignment {
	uuid: string;
	title?: string;
	body?: string | null;
	description?: string | null;
	created_at?: string;
	updated_at?: string;
	sheets?: AssignmentSheet[];
	[key: string]: unknown;
}

export type CreateAssignmentBody = {
	orbit_modul_uuid: string;
	teacher_id: string;
	title: string;
	body?: string | null;
	kkm_value?: number | null;
	date?: string | null; // YYYY-MM-DD
	due_date?: string | null; // YYYY-MM-DD
};

export type UpdateAssignmentBody = Partial<CreateAssignmentBody> & {
	[key: string]: unknown;
};

type AssignmentState = {
	assignments: Assignment[];
	current?: Assignment | null;
	fetchAssignments: (modulUuid: string) => Promise<void>;
	showAssignment: (
		assignmentUuid: string,
	) => Promise<AxiosResponse<Assignment>>;
	storeAssignment: (body: CreateAssignmentBody) => Promise<AxiosResponse>;
	updateAssignment: (
		assignmentUuid: string,
		body: UpdateAssignmentBody,
	) => Promise<AxiosResponse>;
	destroyAssignment: (assignmentUuid: string) => Promise<AxiosResponse>;
	patchGrade: (
		assignmentUuid: string,
		payload: Partial<AssignmentSheet> & { grade: number | string | null },
	) => Promise<AxiosResponse>;
	patchNotes: (
		assignmentUuid: string,
		payload: Partial<AssignmentSheet> & { notes: string | null },
	) => Promise<AxiosResponse>;
};

export const useAssignment = create<AssignmentState>((set, get) => ({
	assignments: [],
	current: null,
	fetchAssignments: async (modulUuid) => {
		const response = await api.get<unknown>(`/modul/assignment/${modulUuid}`);
		const payload = response.data as
			| Assignment[]
			| { data?: Assignment[]; assignments?: Assignment[] }
			| unknown;
		let list: Assignment[] = [];
		if (Array.isArray(payload)) {
			list = payload;
		} else if (payload && typeof payload === "object") {
			const wrapped = payload as { data?: unknown; assignments?: unknown };
			if (Array.isArray(wrapped.data)) list = wrapped.data as Assignment[];
			else if (Array.isArray(wrapped.assignments))
				list = wrapped.assignments as Assignment[];
		}
		set({ assignments: list });
	},
	showAssignment: async (assignmentUuid) => {
		const response = await api.get<Assignment>(
			`/modul/assignment/show/${assignmentUuid}`,
		);
		set({ current: response.data });
		return response;
	},
	storeAssignment: async (body) => {
		const response = await api.post(`/modul/assignment/store`, body);
		if (
			(response.data as unknown as { error?: boolean; message?: string })?.error
		) {
			toast({
				title: "Error",
				description:
					(response.data as unknown as { message?: string })?.message ??
					"Gagal menyimpan tugas",
				variant: "destructive",
			});
		}
		// Auto refresh list if modul is provided in body
		if (body?.orbit_modul_uuid) {
			await get().fetchAssignments(body.orbit_modul_uuid);
		}
		return response;
	},
	updateAssignment: async (assignmentUuid, body) => {
		const response = await api.put(
			`/modul/assignment/update/${assignmentUuid}`,
			body,
		);
		if (
			(response.data as unknown as { error?: boolean; message?: string })?.error
		) {
			toast({
				title: "Error",
				description:
					(response.data as unknown as { message?: string })?.message ??
					"Gagal memperbarui tugas",
				variant: "destructive",
			});
		}
		return response;
	},
	destroyAssignment: async (assignmentUuid) => {
		const response = await api.delete(
			`/modul/assignment/destroy/${assignmentUuid}`,
		);
		if (
			(response.data as unknown as { error?: boolean; message?: string })?.error
		) {
			toast({
				title: "Error",
				description:
					(response.data as unknown as { message?: string })?.message ??
					"Gagal menghapus tugas",
				variant: "destructive",
			});
		}
		return response;
	},
	patchGrade: async (assignmentUuid, payload) => {
		const response = await api.patch(
			`/modul/assignment/patch-sheet/${assignmentUuid}/grade`,
			payload,
		);
		return response;
	},
	patchNotes: async (assignmentUuid, payload) => {
		const response = await api.patch(
			`/modul/assignment/patch-sheet/${assignmentUuid}/notes`,
			payload,
		);
		return response;
	},
}));
