import { Attendance } from "@/types/attendance";
// example response data
// {
//     "uuid": "dcfc8987-3e95-4406-a2d7-658a1b29f19b",
//     "orbit_modul_uuid": "e0c6e072-650c-4ba4-b550-14a4cc15802b",
//     "title": "presensi ketiga",
//     "description": "hanyalah sebuah deskripsi",
//     "created_at": "2023-05-22T04:28:34.000000Z",
//     "updated_at": "2023-05-22T04:28:34.000000Z",
//     "deleted_at": null
// },

export interface Presence {
  uuid: string;
  orbit_modul_uuid: string;
  title: string;
  description: string;
  date: Date | string | number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  attendances?: Attendance[];
  count_h: number; // count of attendances with status "h"
  count_i: number; // count of attendances with status "i"
  count_s: number; // count of attendances with status "s"
  count_a: number; // count of attendances with status "a"
  count_b: number; // count of attendances with status "b"
}
