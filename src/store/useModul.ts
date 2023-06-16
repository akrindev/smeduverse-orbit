// zustand state management for modul

import { create } from "zustand";
import { api } from "@/lib/api";
import { Modul } from "@/types/modul";

// modul state
type ModulState = {
  moduls: Modul[] | Array<any> | null;
  setModul: (modul: any) => void;
  refetch: () => Promise<void>;
};

export const useModul = create<ModulState>((set) => ({
  moduls: [],
  setModul: (moduls) => set({ moduls }),
  refetch: async () => {
    const response = await api.get<Modul[]>("/modul/list");
    const moduls = response.data;
    set({ moduls });
  },
}));
