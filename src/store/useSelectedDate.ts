import { create } from "zustand";

interface ISelectedDate {
  month: number;
  daysCount: number;
  setMonth: (month: number) => void;
  setDaysCount: (num: number) => void;
}

export const useSelectedDate = create<ISelectedDate>((set) => ({
  month: 1,
  daysCount: 1,
  setMonth: (month) => set({ month }),
  setDaysCount: (num) => set({ daysCount: num }),
}));
