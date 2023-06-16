// zustand state management for user teacher and student

import { create } from "zustand";
import { api } from "@/lib/api";
import { Teacher } from "@/types/modul";

// user state
type UserState = {
  teachers: Teacher[] | Array<any> | null;
  setTeachers: (teachers: any) => void;
  refetch: () => Promise<void>;
};

export const useUser = create<UserState>((set) => ({
  teachers: [],
  setTeachers: (teachers) => set({ teachers }),
  refetch: async () => {
    const response = await api.get("/user/teachers");
    const teachers = response.data.data;
    set({ teachers });
  },
}));
