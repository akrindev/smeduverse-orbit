// interface of semester
export interface Semester {
  id: number | string;
  name: string;
  is_active: boolean | number;
  date_start?: string;
  date_end?: string;
  created_at: string;
  updated_at: string;
}
