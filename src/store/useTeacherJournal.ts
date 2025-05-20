// zustand store for teacher journal
import { create } from "zustand";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { AxiosPromise } from "axios";

export interface TeacherJournalEntry {
  uuid: string;
  orbit_modul_uuid: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  subject_schedule_id: number;
  subject_schedule_end_id: number;
  created_at: string;
  updated_at: string;
  count_h: number;
  count_s: number;
  count_i: number;
  count_a: number;
  count_b: number;
  modul: {
    uuid: string;
    rombongan_belajar_id: string;
    mapel_id: number;
    teacher_id: string;
    rombel: {
      id: string;
      nama: string;
    };
    mapel: {
      id: number;
      nama: string;
    };
    teacher: {
      teacher_id: string;
      fullname: string;
      niy: string;
    };
  };
  schedule: {
    id: number;
    subject_key: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
  };
}

export interface TeacherJournalResponse {
  current_page: number;
  data: TeacherJournalEntry[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface TeacherJournalFilter {
  teacher_id: string;
  from: Date;
  to?: Date | null;
}

interface TeacherJournalState {
  journals: TeacherJournalResponse | null;
  isLoading: boolean;
  error: string | null;
  getTeacherJournals: (
    filters: TeacherJournalFilter
  ) => AxiosPromise<TeacherJournalResponse>;
}

export const useTeacherJournal = create<TeacherJournalState>((set) => ({
  journals: null,
  isLoading: false,
  error: null,
  getTeacherJournals: async (filters) => {
    set({ isLoading: true, error: null });

    const { teacher_id, from, to } = filters;

    // Format dates to YYYY-MM-DD
    const formattedFrom = format(from, "yyyy-MM-dd");
    const formattedTo = to ? format(to, "yyyy-MM-dd") : null;

    try {
      // Using GET with query parameters instead of POST with request body
      const response = await api.get("/modul/presence/recap/teacher-journal", {
        params: {
          teacher_id,
          from: formattedFrom,
          to: formattedTo,
        },
      });

      set({ journals: response.data, isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch teacher journals",
        isLoading: false,
      });
      throw error;
    }
  },
}));
