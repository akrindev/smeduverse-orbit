// zustand state management for kelas ajar

import { create } from "zustand";
import { api } from "@/lib/api";
import { KelasAjar } from "@/types/modul";
import { AxiosPromise, AxiosResponse } from "axios";
import { toast } from "@/components/ui/use-toast";

export type Query = {
  teacher_id?: string | null;
  rombel_id?: string | null;
  mapel_id?: string | null;
  semester_id?: string | null;
};

// kelas ajar state
type KelasAjarState = {
  kelasAjars: KelasAjar[] | Array<any> | null;
  kelasAjar: KelasAjar | null;
  setKelasAjar: (kelasAjar: any) => void;
  refetch: (query?: Query | null | undefined) => Promise<void>;
  fetchOwned: (teacher_id: string | null | undefined) => Promise<void>;
  fetchByUuid: (uuid: string | null | undefined) => AxiosPromise<AxiosResponse>;
  store: (body: any) => AxiosPromise<AxiosResponse>;
  destroy: (uuid: string | null | undefined) => AxiosPromise<AxiosResponse>;
};

export const useKelasAjar = create<KelasAjarState>((set, get) => ({
  kelasAjars: [],
  kelasAjar: null,
  setKelasAjar: (kelasAjars) => set({ kelasAjars }),
  refetch: async (query) => {
    // query will be query = {teacher_id, rombel_id, mapel_id, semester_id}
    // those not include at all
    // create query from query object

    // if query is not null, create query string
    const queryString =
      // @ts-ignore
      query === null ? "" : new URLSearchParams(query).toString();

    // is there any option query?
    const response = await api.get<KelasAjar[]>(`/modul/list?${queryString}`);

    const kelasAjars = response.data;

    set({ kelasAjars });
  },
  fetchOwned: async (teacher_id) => {
    const response = await api.get<KelasAjar[]>(
      `/modul/list?teacher_id=${teacher_id}`
    );
    const kelasAjars = response.data;
    set({ kelasAjars });
  },
  fetchByUuid: async (uuid) => {
    // empty kelas ajar
    const response = await api.get(`/modul/show/${uuid}`);
    const kelasAjar = response.data;

    set({ kelasAjar });

    return response;
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
  destroy: async (uuid) => {
    const response = await api.delete(`/modul/destroy/${uuid}`);

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
