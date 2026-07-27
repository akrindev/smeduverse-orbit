export interface ApelStudent {
	student_id: string;
	fullname: string;
	nipd: string;
	photo?: string;
}

export interface ApelRombel {
	id: string;
	nama: string;
}

export interface ApelAttendance {
	id: number;
	student_id: string;
	rombongan_belajar_id: string;
	attendance_type: "apel" | "kelas" | string | null;
	attendance_status: "h" | "s" | "i" | "a" | string | null;
	attendance_date: string;
	created_at?: string;
	updated_at?: string;
	student?: ApelStudent;
	rombel?: ApelRombel;
}

export interface StoreApelAttendancePayload {
	nis: string;
}

export interface StoreApelAttendanceResponse {
	message: string;
	student?: ApelStudent;
	attendance?: ApelAttendance;
	code: number;
}

export interface PaginatedApelAttendance {
	data: ApelAttendance[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}

export interface LatestApelAttendanceResponse {
	message: string;
	attendances: PaginatedApelAttendance;
}

export interface MonthlyApelAttendanceResponse {
	message: string;
	rombel: string;
	bulan: string;
	tahun: number;
	attendances: Record<string, ApelAttendance[]>;
}

export interface StudentApelHistoryResponse {
	message: string;
	attendances: ApelAttendance[];
}

export interface OrbitSetting {
	id: number;
	key: string;
	value: any;
	created_at: string;
	updated_at: string;
}

export interface UpdateOrbitSettingPayload {
	key: string;
	value: any;
}
