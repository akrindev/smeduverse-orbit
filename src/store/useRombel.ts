// zustand rombel state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Rombel } from "@/types/modul";

type RombelState = {
  rombels: Rombel[] | Array<any> | null;
  selectedRombelId: string;
  setSelectedRombelId: (id: string) => void;
  setRombel: (rombels: any) => void;
  refetch: () => Promise<void>;
};

export const useRombel = create<RombelState>((set) => ({
  rombels: [],
  selectedRombelId: "all",
  setSelectedRombelId: (id) => set({ selectedRombelId: id }),
  setRombel: (rombels) => set({ rombels }),
  refetch: async () => {
    const response = await api.get("/rombel/list");
    const rombels = response.data;
    set({ rombels });
  },
}));
