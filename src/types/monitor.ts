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
  count_h: number;
  count_s: number;
  count_i: number;
  count_a: number;
  count_b: number;
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

export interface MonitorJournal {
  current_page: number;
  data: Journal[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Link[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface Journal {
  uuid: string;
  orbit_modul_uuid: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  subject_schedule_id: number;
  subject_schedule_end_id: number;
  created_at: string;
  updated_at: string;
  count_h: number;
  count_s: number;
  count_i: number;
  count_a: number;
  count_b: number;
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

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}
