import { Mapel, Rombel, Teacher } from "./modul";
import { Presence } from "./presence";

export interface ActivePresenceMonitor {
  current_time: string;
  debug: {
    total_presences: number;
    rombels_with_presences: number;
    time_condition: string;
  };
  rombel: RombelWithPresence[];
}

export interface RombelWithPresence {
  id: string;
  nama: string;
  tingkat_kelas: number;
  presence: ActivePresence | null;
}

export interface ActivePresence {
  uuid: string;
  orbit_modul_uuid: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  subject_schedule_id: number;
  created_at: string;
  updated_at: string;
  modul: {
    uuid: string;
    rombongan_belajar_id: string;
    mapel_id: number;
    teacher_id: string;
    rombel: {
      id: string;
      nama: string;
    };
    mapel: {
      id: number;
      nama: string;
    };
    teacher: {
      teacher_id: string;
      fullname: string;
      niy: string;
    };
  };
  schedule: {
    id: number;
    subject_key: number;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
    deleted_at: null | string;
  };
}
