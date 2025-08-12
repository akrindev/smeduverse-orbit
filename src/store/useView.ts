import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "table" | "grid";

interface ViewState {
  selectedView: ViewMode;
  setSelectedView: (view: ViewMode) => void;
}

export const useView = create<ViewState>()(
  persist(
    (set) => ({
      selectedView: "table",
      setSelectedView: (view) => set({ selectedView: view }),
    }),
    { name: "view-preference" }
  )
);


