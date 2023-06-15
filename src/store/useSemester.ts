// zustand semester state
import { api } from "@/lib/api";
import { Semester } from "@/types/semester";
import { AxiosResponse } from "axios";
import { create } from "zustand";

type Body = {
  name: string;
  is_active: boolean | number;
};

type SemesterState = {
  semesters: Semester[];
  setSemesters: (semester: Semester[]) => void;
  refetch: () => Promise<void>;
  store: (body: Body) => Promise<AxiosResponse>;
  update: (id: number | string, body: Body) => Promise<AxiosResponse>;
  delete: (id: number | string) => Promise<AxiosResponse>;
};

export const useSemester = create<SemesterState>((set, get) => ({
  semesters: [],
  setSemesters: (semesters) => set({ semesters }),
  refetch: async () => {
    const response = await api.get<Semester[]>("/semester/list");
    const semesters = response.data;
    set({ semesters });
  },
  store: async (body) => {
    const response = await api.post("/semester/store", body);

    // call refetch
    await get().refetch();

    return response;
  },
  update: async (id, body) => {
    const response = await api.put(`/semester/update/${id}`, body);

    // call refetch
    await get().refetch();

    return response;
  },
  delete: async (id) => {
    const response = await api.delete(`/semester/destroy/${id}`);

    // call refetch
    await get().refetch();

    return response;
  },
}));
