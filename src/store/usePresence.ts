// zustand presence state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Presence } from "@/types/presence";
import { AxiosPromise, AxiosResponse } from "axios";
import { Attendance } from "@/types/attendance";

type Data = Pick<Presence, "orbit_modul_uuid" | "title" | "description"> & {
  presence_uuid?: string;
};

type PresenceState = {
  presences: Presence[] | Array<any>;
  presence: Presence | any;
  fetchPresences: (modulUuid: string) => Promise<void>;
  showPresence: (presenceUuid: string) => Promise<void>;
  createPresence: (data: Data) => AxiosPromise<AxiosResponse>;
  updatePresence: (data: Data) => AxiosPromise<AxiosResponse>;
  destroyPresence: (
    data: Pick<Presence, "orbit_modul_uuid">
  ) => AxiosPromise<AxiosResponse>;
  updateAttendance: ({
    attendance,
    status,
  }: {
    attendance: Attendance;
    status: string | "h" | "i" | "s" | "a" | "b";
  }) => AxiosPromise<AxiosResponse<{ message: string; in_status: string }>>;
};

export const usePresence = create<PresenceState>((set, get) => ({
  presences: [],
  presence: {},
  fetchPresences: async (modulUuid) => {
    const response = await api.get(`/modul/presence/${modulUuid}`);
    set({ presences: response.data });
  },
  showPresence: async (presenceUuid) => {
    const response = await api.get(`/modul/presence/show/${presenceUuid}`);
    set({ presence: response.data });
  },
  createPresence: async (data) => {
    const response = await api.post(`/modul/presence/store`, data);

    get().fetchPresences(data.orbit_modul_uuid);

    return response;
  },
  updatePresence: async (data) => {
    const response = await api.put(
      `/modul/presence/update/${data.presence_uuid}`,
      data
    );

    get().showPresence(data.presence_uuid!);

    return response;
  },
  destroyPresence: async (data) => {
    const response = await api.delete(
      `/modul/presence/destroy/${data.orbit_modul_uuid}`
    );

    get().fetchPresences(data.orbit_modul_uuid);

    return response;
  },
  updateAttendance: async ({ attendance, status }) => {
    const presenceUuid = get().presence.uuid;

    // if not presence uuid then throw error
    if (!presenceUuid) {
      throw new Error("Presence uuid not found");
    }

    console.log("aa", attendance);

    const data = {
      ...attendance,
      status,
    };

    const response = await api.patch(
      `/modul/presence/patch-attendance/${presenceUuid}`,
      data
    );

    return response;
  },
}));
