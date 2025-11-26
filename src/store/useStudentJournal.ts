// Student Journal Store
export interface Attendance {
	status: string;
	notes: string | null;
}

export interface Module {
	uuid: string;
	mapel: {
		id: number;
		nama: string;
		kode: string;
	};
	teacher: {
		teacher_id: string;
		fullname: string;
		niy: string;
	};
}

export interface Journal {
	presence_uuid: string;
	title: string;
	description: string;
	date: string;
	created_at: string;
	start_time: string;
	end_time: string;
	modul: Module;
	attendance: Attendance;
	is_present: boolean;
}

export interface Student {
	student_id: string;
	fullname: string;
	nisn: string;
	nipd: string;
	photo: string;
	journals: Journal[];
	total_journals: number;
	total_present: number;
	total_absent: number;
}

export interface StudentsPagination {
	current_page: number;
	data: Student[];
	first_page_url: string | null;
	from: number;
	last_page: number;
	last_page_url: string | null;
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

export interface Rombel {
	id: string;
	nama: string;
	tingkat_kelas: number;
	total_students: number;
}

export interface Filters {
	from: string;
	to: string;
}

export interface StudentJournalResponse {
	rombel: Rombel;
	students: StudentsPagination;
	filters: Filters;
}
