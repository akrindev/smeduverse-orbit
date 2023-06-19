// zustand state management for modul

import { create } from "zustand";
import { api } from "@/lib/api";
import { Modul } from "@/types/modul";
import { AxiosPromise, AxiosResponse } from "axios";
import { toast } from "@/components/ui/use-toast";

// modul state
type ModulState = {
  moduls: Modul[] | Array<any> | null;
  setModul: (modul: any) => void;
  refetch: () => Promise<void>;
  fetchOwned: (teacher_id: string | null | undefined) => Promise<void>;
  store: (body: any) => AxiosPromise<AxiosResponse>;
};

export const useModul = create<ModulState>((set, get) => ({
  moduls: [],
  setModul: (moduls) => set({ moduls }),
  refetch: async () => {
    const response = await api.get<Modul[]>("/modul/list");
    const moduls = response.data;
    set({ moduls });
  },
  fetchOwned: async (teacher_id) => {
    const response = await api.get<Modul[]>(
      `/modul/list?teacher_id=${teacher_id}`
    );
    const moduls = response.data;
    set({ moduls });
  },
  store: async (body) => {
    const response = await api.post("/modul/store", body);

    // if error
    if (response.data.error) {
      toast({
        title: "Error",
        description: response.data.message,
        variant: "destructive",
      });
    }

    // call refetch
    await get().refetch();

    return response;
  },
}));
