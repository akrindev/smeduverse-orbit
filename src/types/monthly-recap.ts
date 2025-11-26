// Types for monthly presence recap

export interface MonthlyRecapMeta {
	rombel_id: string;
	rombel_nama: string;
	jurusan: string;
	month: string;
	year: string;
	period: string;
	total_session_days: number;
	total_students: number;
}

export interface StudentRecap {
	student_id: string;
	fullname: string;
	nisn: string;
	nipd: string;
	photo: string;
	count_h: number; // Hadir (Present)
	count_s: number; // Sakit (Sick)
	count_i: number; // Izin (Permission)
	count_a: number; // Alpa (Absent without permission)
	count_b: number; // Bolos (Truant)
	total_days: number;
	attendance_rate: number;
}

export interface MonthlyRecapResponse {
	meta: MonthlyRecapMeta;
	students: StudentRecap[];
}

// Types for monthly-all endpoint (all classes)
export interface MonthlyRecapAllMeta {
	month: string;
	year: string;
	period: string;
	tahun_ajaran: string | null;
	semester: string | null;
	total_classes: number;
	total_students: number;
	summary: {
		count_h: number;
		count_s: number;
		count_i: number;
		count_a: number;
		count_b: number;
		total_records: number;
		attendance_rate: number;
	};
}

export interface ClassRecap {
	rombel_id: string;
	rombel_nama: string;
	tingkat_kelas: number;
	jurusan: string;
	tahun_ajaran: string;
	wali_kelas: string;
	total_students: number;
	total_students_with_attendance: number;
	total_session_days: number;
	count_h: number;
	count_s: number;
	count_i: number;
	count_a: number;
	count_b: number;
	total_records: number;
	attendance_rate: number;
}

export interface MonthlyRecapAllResponse {
	meta: MonthlyRecapAllMeta;
	classes: ClassRecap[];
}

export interface MonthlyRecapAllBody {
	month: number;
	year: number;
}

export interface MonthlyRecapBody {
	rombel_id: string;
	month: number;
	year: number;
}

// Types for monthly-student endpoint (individual student)
export interface MonthlyStudentRecapMeta {
	student_id: string;
	student_name: string;
	nisn: string;
	nipd: string;
	photo: string;
	rombel_id: string;
	rombel_nama: string;
	jurusan: string;
	month: number;
	year: number;
	period: string;
	total_session_days: number;
}

export interface DailyAttendance {
	date: string;
	day: string;
	day_number: number;
	status: string;
	status_label: string;
	notes: string | null;
	recorded_at: string;
}

export interface MonthlyStudentRecapSummary {
	count_h: number;
	count_s: number;
	count_i: number;
	count_a: number;
	count_b: number;
	total_days: number;
	attendance_rate: number;
}

export interface MonthlyStudentRecapResponse {
	meta: MonthlyStudentRecapMeta;
	summary: MonthlyStudentRecapSummary;
	daily_attendance: DailyAttendance[];
}

export interface MonthlyStudentRecapBody {
	student_id: string;
	rombel_id: string;
	month: number;
	year: number;
}
