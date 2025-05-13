// zustand state management for user teacher and student

import { create } from "zustand";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// teacher type
type Teacher = {
  id: string;
  teacher_id: string;
  fullname: string;
  niy: string;
  photo: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
};

// user state
type UserState = {
  teachers: Teacher[] | Array<any> | null;
  setTeachers: (teachers: any) => void;
  refetch: () => Promise<void>;
};

/* @deprecated use useUserQuery */
export const useUser = create<UserState>((set) => ({
  teachers: [],
  setTeachers: (teachers) => set({ teachers }),
  refetch: async () => {
    const response = await api.get("/user/teachers");
    const teachers = response.data.data;
    set({ teachers });
  },
}));


export const useUserQuery = () => {
  // Fetch todos
  const { data: teachers = [], isLoading } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: async () => await api.get('/user/teachers').then(res => res.data.data),
  })

  return { teachers, isLoading }
}