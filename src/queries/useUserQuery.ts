"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Query keys for user-related queries
export const userQueryKeys = {
	teachers: ["teachers"],
};

// Teacher type
export interface Teacher {
	id: string;
	teacher_id: string;
	fullname: string;
	niy: string;
	photo: string;
	jenis_kelamin: string;
	tempat_lahir: string;
	tanggal_lahir: string;
}

/**
 * React Query hook for fetching all teachers
 */
export function useTeachersQuery() {
	return useQuery<Teacher[]>({
		queryKey: userQueryKeys.teachers,
		queryFn: async () => {
			const response = await api.get("/user/teachers");
			return response.data.data;
		},
		refetchOnWindowFocus: false,
	});
}
