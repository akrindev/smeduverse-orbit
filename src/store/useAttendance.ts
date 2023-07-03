// zustand attendance state

import { create } from "zustand";
import { api } from "@/lib/api";
import { Attendance } from "@/types/attendance";
import { AxiosPromise, AxiosResponse } from "axios";

type AttendanceState = {
  attendances: Attendance[] | Array<any>;
  title: string;
  description: string;
  fetchAttendances: (presenceUuid: string) => AxiosPromise<AxiosResponse>;
  getRecapAttendances: (modulUuid: string) => AxiosPromise<AxiosResponse>;
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
}));
