import { create } from "zustand";
import { api } from "@/lib/api";

export interface SubjectSchedule {
  id: number;
  subject_key: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface SubjectScheduleState {
  schedules: SubjectSchedule[];
  loading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  addSchedule: (
    schedule: Omit<
      SubjectSchedule,
      "id" | "created_at" | "updated_at" | "deleted_at"
    >
  ) => Promise<void>;
  updateSchedule: (
    id: number,
    schedule: Partial<SubjectSchedule>
  ) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;
}

export const useSubjectSchedule = create<SubjectScheduleState>((set, get) => ({
  schedules: [],
  loading: false,
  error: null,

  // Fetch all subject schedules
  fetchSchedules: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get("/subject-schedule/list");
      if (response.data.success) {
        set({ schedules: response.data.data });
      } else {
        set({ error: "Failed to fetch schedules" });
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
      set({ error: "An error occurred while fetching schedules" });
    } finally {
      set({ loading: false });
    }
  },

  // Add a new subject schedule
  addSchedule: async (schedule) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post("/subject-schedule/store", schedule);
      if (response.data.success) {
        const updatedSchedules = [...get().schedules, response.data.data];
        set({ schedules: updatedSchedules });
      } else {
        set({ error: "Failed to add schedule" });
      }
    } catch (error) {
      console.error("Error adding schedule:", error);
      set({ error: "An error occurred while adding the schedule" });
    } finally {
      set({ loading: false });
    }
  },

  // Update an existing subject schedule
  updateSchedule: async (id, schedule) => {
    try {
      set({ loading: true, error: null });
      const response = await api.put(
        `/subject-schedule/update/${id}`,
        schedule
      );
      if (response.data.success) {
        const updatedSchedules = get().schedules.map((item) =>
          item.id === id ? { ...item, ...response.data.data } : item
        );
        set({ schedules: updatedSchedules });
      } else {
        set({ error: "Failed to update schedule" });
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      set({ error: "An error occurred while updating the schedule" });
    } finally {
      set({ loading: false });
    }
  },

  // Delete a subject schedule
  deleteSchedule: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await api.delete(`/subject-schedule/delete/${id}`);
      if (response.data.success) {
        const filteredSchedules = get().schedules.filter(
          (item) => item.id !== id
        );
        set({ schedules: filteredSchedules });
      } else {
        set({ error: "Failed to delete schedule" });
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      set({ error: "An error occurred while deleting the schedule" });
    } finally {
      set({ loading: false });
    }
  },
}));
