// zustand mapel state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Mapel } from "@/types/modul";
import { AxiosPromise, AxiosResponse } from "axios";
import { toast } from "@/components/ui/use-toast";

type MapelState = {
  mapels: Mapel[] | Array<any>;
  setMapels: (mapels: any) => void;
  refetch: () => Promise<void>;
  store: (data: any) => AxiosPromise<AxiosResponse>;
  update: (id: number, data: any) => AxiosPromise<AxiosResponse>;
  delete: (id: number) => AxiosPromise<AxiosResponse>;
};

export const useMapel = create<MapelState>((set, get) => ({
  mapels: [],
  setMapels: (mapels) => set({ mapels }),
  refetch: async () => {
    const response = await api.get("/mapel/list");
    const mapels = response.data;
    set({ mapels });
  },
  store: async (data) => {
    const response = await api.post("/mapel/store", data);

    get().refetch();

    return response;
  },
  update: async (id, data) => {
    const response = await api.put(`/mapel/update/${id}`, data);

    get().refetch();

    return response;
  },
  delete: async (id) => {
    const response = await api.delete(`/mapel/destroy/${id}`);

    get().refetch();

    return response;
  },
}));
