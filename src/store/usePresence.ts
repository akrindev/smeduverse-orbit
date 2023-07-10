// zustand presence state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Presence } from "@/types/presence";
import { AxiosPromise, AxiosResponse } from "axios";
import { Attendance } from "@/types/attendance";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";

type Data = Pick<Presence, "orbit_modul_uuid" | "title" | "description"> & {
  presence_uuid?: string;
};

type PresenceState = {
  presences: Presence[] | Array<any>;
  presence: Presence | any;
  fetchPresences: (modulUuid: string) => Promise<void>;
  showPresence: (presenceUuid: string) => AxiosPromise<AxiosResponse>;
  createPresence: (data: Data) => AxiosPromise<AxiosResponse>;
  updatePresence: (data: Data) => AxiosPromise<AxiosResponse>;
  destroyPresence: (data: string) => AxiosPromise<AxiosResponse>;
  updateAttendance: ({
    attendance,
    status,
  }: {
    attendance: Attendance;
    status: string | "h" | "i" | "s" | "a" | "b";
  }) => AxiosPromise<AxiosResponse<{ message: string; in_status: string }>>;
  updateAttendanceNotes: ({
    attendance,
    notes,
  }: {
    attendance: Attendance;
    notes: string | null;
  }) => AxiosPromise<AxiosResponse<{ message: string; in_notes: string }>>;
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

    return response;
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
    const response = await api.delete(`/modul/presence/destroy/${data}`);

    return response;
  },
  updateAttendance: async ({ attendance, status }) => {
    const presenceUuid = get().presence.uuid;

    // if not presence uuid then throw error
    if (!presenceUuid) {
      throw new Error("Presence uuid not found");
    }

    // console.log("aa", attendance);

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
  updateAttendanceNotes: async ({ attendance, notes }) => {
    const presenceUuid = get().presence.uuid;

    // if not presence uuid then throw error
    if (!presenceUuid) {
      throw new Error("Presence uuid not found");
    }

    const data = {
      ...attendance,
      notes,
    };

    const response = await api.patch(
      `/modul/presence/patch-attendance/${presenceUuid}/notes`,
      data
    );

    return response;
  },
}));
