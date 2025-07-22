// zustand presence state
import { create } from "zustand";
import { api } from "@/lib/api";
import { Presence } from "@/types/presence";
import { AxiosPromise, AxiosResponse } from "axios";
import { Attendance, IAttendance } from "@/types/attendance";
import { format } from "date-fns";

type Data = Pick<Presence, "orbit_modul_uuid" | "title" | "description"> & {
  presence_uuid?: string;
};

export interface JournalResponse {
  current_page: number;
  data: IAttendance[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

type JournalProps = {
  rombel_id: string;
  from: Date;
  to?: Date;
  page?: number;
};

type PresenceState = {
  presences: Presence[] | Array<any>;
  presence: Presence | any;
  journals: IAttendance[] | Array<any>;
  journalResponse: JournalResponse | null;
  currentPage: number;
  lastPage: number;
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
  getJournalKelas: (data: JournalProps) => AxiosPromise<JournalResponse>;
};

export const usePresence = create<PresenceState>((set, get) => ({
  presences: [],
  presence: {},
  journals: [],
  journalResponse: null,
  currentPage: 1,
  lastPage: 1,
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
  // get journal kelas
  getJournalKelas: async (data) => {
    // parse the data
    const { from, to, rombel_id, page = 1 } = data;
    // from to must be in string format YYYY-MM-DD / 2023-08-22
    const formattedFrom = format(from as Date, "yyyy-MM-dd");
    const formattedTo = to ? format(to as Date, "yyyy-MM-dd") : "";

    // Changed from POST to GET with query parameters to match API expectations
    const response = await api
      .post(`/modul/presence/recap/journal`, {
        from: formattedFrom,
        to: formattedTo,
        rombel_id,
        page,
      })
      .then((res) => res.data);

    set({
      journals: response.data,
      journalResponse: response,
      currentPage: response.current_page,
      lastPage: response.last_page,
    });

    return response;
  },
}));
