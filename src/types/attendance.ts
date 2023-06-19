export interface IAttendance {
  uuid: string;
  orbit_modul_uuid: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  attendances: Attendance[];
}

export interface Attendance {
  student_id: string;
  fullname: string;
  nisn: string;
  nipd: string;
  photo: string;
  presence: Presence;
  rombongan_belajar: RombonganBelajar[];
  rombel_aktif: RombelAktif[];
}

export interface Presence {
  orbit_presence_uuid: string;
  student_id: string;
  status: string;
  notes: any;
  created_at: string;
  updated_at: string;
}

export interface RombonganBelajar {
  id: string;
  nama: string;
  tingkat_kelas: number;
  jurusan_id: number;
  tahun_ajaran_id: number;
  wali_id: string;
  image: string;
  status_aktif: number;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  student_id: string;
  rombongan_belajar_id: string;
}

export interface RombelAktif {
  id: string;
  nama: string;
  tingkat_kelas: number;
  jurusan_id: number;
  tahun_ajaran_id: number;
  wali_id: string;
  image: string;
  status_aktif: number;
  created_at: string;
  updated_at: string;
  pivot: Pivot2;
}

export interface Pivot2 {
  student_id: string;
  rombongan_belajar_id: string;
}
