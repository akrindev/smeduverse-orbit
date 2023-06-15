// zustand semester state
import { api } from "@/lib/api";
import { Semester } from "@/types/semester";
import { create } from "zustand";

type SemesterState = {
  semesters: Semester[];
  setSemesters: (semester: Semester[]) => void;
  refetch: () => Promise<void>;
};

export const useSemester = create<SemesterState>((set) => ({
  semesters: [],
  setSemesters: (semesters) => set({ semesters }),
  refetch: async () => {
    const response = await api.get<Semester[]>("/semester/list");
    const semesters = response.data;
    set({ semesters });
  },
}));
