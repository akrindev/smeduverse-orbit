// zustand attendance state

import type { AxiosPromise, AxiosResponse } from "axios";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { create } from "zustand";
import { api } from "@/lib/api";
import type { Attendance } from "@/types/attendance";

type DataDateRange = {
	status: string | "no" | "h" | "i" | "s" | "a" | "b";
	rombel_id?: string;
} & DateRange;

type AttendanceState = {
	attendances: Attendance[] | Array<any>;
	title: string;
	description: string;
	fetchAttendances: (presenceUuid: string) => AxiosPromise<AxiosResponse>;
	getRecapAttendances: (modulUuid: string) => AxiosPromise<AxiosResponse>;
	getRecapByDateRange: (data: DataDateRange) => AxiosPromise<AxiosResponse>;
};

export const useAttendance = create<AttendanceState>((set, get) => ({
	attendances: [],
	title: "",
	description: "",
	fetchAttendances: async (presenceUuid) => {
		const response = await api.get(`/modul/presence/show/${presenceUuid}`);

		const { attendances, title, description } = response.data;

		set({ attendances, title, description });

		return response;
	},
	getRecapAttendances: async (modulUuid) => {
		const response = await api.get(`/modul/presence/recap/${modulUuid}`);

		return response;
	},
	getRecapByDateRange: async (data) => {
		// parse the data
		const { from, to, status, rombel_id } = data;
		// from to must be in string format YYYY-MM-DD / 2023-08-22
		const formattedFrom = format(from as Date, "yyyy-MM-dd");
		const formattedTo = to ? format(to as Date, "yyyy-MM-dd") : "";

		// console.log(formattedFrom, formattedTo, to);

		const response = await api.post(`/modul/presence/recap/date-range`, {
			from: formattedFrom,
			to: formattedTo,
			status,
			rombel_id,
		});

		return response;
	},
}));
