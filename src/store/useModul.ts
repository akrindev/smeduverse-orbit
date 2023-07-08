// zustand state management for modul

import { create } from "zustand";
import { api } from "@/lib/api";
import { Modul } from "@/types/modul";
import { AxiosPromise, AxiosResponse } from "axios";
import { toast } from "@/components/ui/use-toast";

export type Query = {
  teacher_id?: string | null;
  rombel_id?: string | null;
  mapel_id?: string | null;
  semester_id?: string | null;
};

// modul state
type ModulState = {
  moduls: Modul[] | Array<any> | null;
  modul: Modul | null;
  setModul: (modul: any) => void;
  refetch: (query?: Query | null | undefined) => Promise<void>;
  fetchOwned: (teacher_id: string | null | undefined) => Promise<void>;
  fetchByUuid: (uuid: string | null | undefined) => Promise<void>;
  store: (body: any) => AxiosPromise<AxiosResponse>;
};

export const useModul = create<ModulState>((set, get) => ({
  moduls: [],
  modul: null,
  setModul: (moduls) => set({ moduls }),
  refetch: async (query) => {
    // query will be query = {teacher_id, rombel_id, mapel_id, semester_id}
    // those not include at all
    // create query from query object

    // if query is not null, create query string
    const queryString =
      // @ts-ignore
      query === null ? "" : new URLSearchParams(query).toString();

    // is there any option query?
    const response = await api.get<Modul[]>(`/modul/list?${queryString}`);

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
  fetchByUuid: async (uuid) => {
    const response = await api.get<Modul>(`/modul/show/${uuid}`);
    const modul = response.data;
    set({ modul });
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
