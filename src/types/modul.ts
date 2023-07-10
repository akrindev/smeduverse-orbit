export interface Modul {
  uuid: string;
  teacher_id: string;
  rombongan_belajar_id: string;
  mapel_id: number;
  semester_id: number;
  status: number;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
  teacher: Teacher;
  rombel: Rombel;
  mapel: Mapel;
  semester: Semester;
}

export interface Mapel {
  id: number;
  kode: string;
  nama: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
}

export interface Jurusan extends Mapel {}

export interface Rombel {
  id: string;
  nama: string;
  tingkat_kelas: number;
  jurusan_id: number;
  tahun_ajaran_id: number;
  wali_id: string;
  image: string;
  status_aktif: number;
  created_at: Date | string;
  updated_at: Date | string;
  wali_kelas: Teacher;
  jurusan?: Jurusan;
}

export interface Teacher {
  teacher_id: string;
  fullname: string;
  niy: string;
  photo?: string | null;
}

export interface Semester {
  id: string | number;
  name: string;
  is_active: boolean | number;
  date_start?: null;
  date_end?: null;
  created_at: Date | string;
  updated_at: Date | string;
}
