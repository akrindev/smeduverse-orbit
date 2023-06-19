// zustand presence state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Presence } from "@/types/presence";
import { AxiosPromise, AxiosResponse } from "axios";

type PresenceState = {
  presences: Presence[] | Array<any>;
  fetchPresences: (modulUuid: string) => Promise<void>;
  createPresence: (
    data: Pick<Presence, "orbit_modul_uuid" | "title" | "description">
  ) => AxiosPromise<AxiosResponse>;
  updatePresence: (
    data: Pick<Presence, "orbit_modul_uuid" | "title" | "description">
  ) => AxiosPromise<AxiosResponse>;
};

export const usePresence = create<PresenceState>((set, get) => ({
  presences: [],
  fetchPresences: async (modulUuid) => {
    const response = await api.get(`/modul/presence/${modulUuid}`);
    set({ presences: response.data });
  },
  createPresence: async (data) => {
    const response = await api.post(`/modul/presence/store`, data);

    get().fetchPresences(data.orbit_modul_uuid);

    return response;
  },
  updatePresence: async (data) => {
    const response = await api.put(
      `/modul/presence/update/${data.orbit_modul_uuid}`,
      data
    );

    get().fetchPresences(data.orbit_modul_uuid);

    return response;
  },
}));
