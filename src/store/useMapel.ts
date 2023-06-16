// zustand mapel state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Mapel } from "@/types/modul";

type MapelState = {
  mapels: Mapel[] | Array<any> | null;
  setMapels: (mapels: any) => void;
  refetch: () => Promise<void>;
};

export const useMapel = create<MapelState>((set) => ({
  mapels: [],
  setMapels: (mapels) => set({ mapels }),
  refetch: async () => {
    const response = await api.get("/mapel/list");
    const mapels = response.data;
    set({ mapels });
  },
}));
