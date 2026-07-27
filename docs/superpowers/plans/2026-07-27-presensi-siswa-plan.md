# Presensi Siswa Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Presensi Siswa" (Apel Attendance) feature on Orbit web app with RFID & QR code scanning (no manual input), daily attendance listing, monthly rekap matrix, student history lookup, and settings management, integrated into Quick Menu & Sidebar.

**Architecture:** Create dedicated data types in `src/types/apel-attendance.ts`, query hooks in `src/queries/useApelAttendanceQuery.ts`, and sub-routes under `/presensi-siswa` with a top navigation bar. Menu items registered in `menu-list.ts` automatically activate Quick Menu & Sidebar.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Axios, Lucide React / Tabler Icons, Web Audio API, Shadcn UI, Sonner toasts.

---

### Task 1: Create Presensi Siswa Types

**Files:**
- Create: `src/types/apel-attendance.ts`

- [ ] **Step 1: Create `src/types/apel-attendance.ts`**

```typescript
export interface ApelStudent {
	student_id: string;
	fullname: string;
	nipd: string;
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/apel-attendance.ts
git commit -m "feat: add types for presensi siswa apel attendance"
```

---

### Task 2: Create React Query Hooks for Apel Attendance

**Files:**
- Create: `src/queries/useApelAttendanceQuery.ts`

- [ ] **Step 1: Create `src/queries/useApelAttendanceQuery.ts`**

```typescript
"use client";

import { api } from "@/lib/api";
import type {
	ApelAttendance,
	LatestApelAttendanceResponse,
	MonthlyApelAttendanceResponse,
	OrbitSetting,
	StoreApelAttendancePayload,
	StoreApelAttendanceResponse,
	StudentApelHistoryResponse,
	UpdateOrbitSettingPayload,
} from "@/types/apel-attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const apelAttendanceQueryKeys = {
	all: ["apel-attendance"] as const,
	latest: (date?: string, rombelId?: string) =>
		[...apelAttendanceQueryKeys.all, "latest", date, rombelId] as const,
	month: (rombelId: string, month?: number, year?: number) =>
		[...apelAttendanceQueryKeys.all, "month", rombelId, month, year] as const,
	student: (studentId: string, month?: number, year?: number) =>
		[...apelAttendanceQueryKeys.all, "student", studentId, month, year] as const,
	setting: (key: string) => [...apelAttendanceQueryKeys.all, "setting", key] as const,
};

export function useStoreApelAttendanceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: StoreApelAttendancePayload): Promise<StoreApelAttendanceResponse> => {
			const response = await api.post("/attendance/apel/store", payload);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: apelAttendanceQueryKeys.all });
		},
	});
}

export function useLatestApelAttendanceQuery(params?: { date?: string; rombel_id?: string; page?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.latest(params?.date, params?.rombel_id),
		queryFn: async (): Promise<LatestApelAttendanceResponse> => {
			const response = await api.get("/attendance/apel/latest", { params });
			return response.data;
		},
	});
}

export function useMonthlyApelAttendanceQuery(params: { rombel_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.month(params.rombel_id, params.month, params.year),
		queryFn: async (): Promise<MonthlyApelAttendanceResponse> => {
			const response = await api.get("/attendance/apel/month", { params });
			return response.data;
		},
		enabled: !!params.rombel_id,
	});
}

export function useStudentApelHistoryQuery(params: { student_id: string; month?: number; year?: number }) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.student(params.student_id, params.month, params.year),
		queryFn: async (): Promise<StudentApelHistoryResponse> => {
			const response = await api.get("/attendance/apel/student", { params });
			return response.data;
		},
		enabled: !!params.student_id,
	});
}

export function useDeleteApelAttendanceMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id: number) => {
			const response = await api.delete(`/attendance/apel/delete/${id}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: apelAttendanceQueryKeys.all });
		},
	});
}

export function useOrbitSettingQuery(key: string) {
	return useQuery({
		queryKey: apelAttendanceQueryKeys.setting(key),
		queryFn: async (): Promise<OrbitSetting> => {
			const response = await api.get("/attendance/setting/get", { params: { key } });
			return response.data;
		},
		enabled: !!key,
	});
}

export function useUpdateOrbitSettingMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (payload: UpdateOrbitSettingPayload): Promise<{ message: string; setting: OrbitSetting }> => {
			const response = await api.put("/attendance/setting/update", payload);
			return response.data;
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: apelAttendanceQueryKeys.setting(variables.key) });
		},
	});
}
```

- [ ] **Step 2: Commit**

```bash
git add src/queries/useApelAttendanceQuery.ts
git commit -m "feat: add react query hooks for apel attendance endpoints"
```

---

### Task 3: Register Presensi Siswa in Menu List

**Files:**
- Modify: `src/app/(authenticated)/components/menu-list.ts`

- [ ] **Step 1: Update `menu-list.ts`**

Add `{ name: "Presensi Siswa", title: "Presensi Siswa", icon: IconUserCheck, path: "/presensi-siswa", roles: ["guru", "admin"] }` to `menuList`.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/components/menu-list.ts
git commit -m "feat: add Presensi Siswa to menuList for guru and admin roles"
```

---

### Task 4: Create Layout and Sub-navigation Header

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/layout.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/layout.tsx`**

Build shared layout with header, sub-navigation tabs (Hub, Scan, Harian, Rekap, Riwayat, Pengaturan), and breadcrumbs.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/layout.tsx
git commit -m "feat: add shared layout and sub-navigation header for presensi siswa"
```

---

### Task 5: Create Presensi Siswa Dashboard Hub Page

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/page.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/page.tsx`**

Dashboard hub showing summary metrics for today's apel attendance, status overview (Hadir, Sakit, Izin, Alpa), and quick navigation cards to `/presensi-siswa/scan`, `/presensi-siswa/harian`, `/presensi-siswa/rekap`, `/presensi-siswa/riwayat`, and `/presensi-siswa/pengaturan`.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/page.tsx
git commit -m "feat: add presensi siswa hub page"
```

---

### Task 6: Create Presensi Siswa Scanner Page (RFID & QR Code)

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/scan/page.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/scan/page.tsx`**

Features:
- **No Manual Input**: Only accepts automated scanner input.
- **RFID USB Reader Listener**: Invisible/auto-focused input capture listening for fast keystrokes ending with `Enter`.
- **QR Code Camera Scanner**: WebRTC camera stream canvas decoding or `html5-qrcode` integration with toggle button.
- **Audio Feedback**: Built-in Web Audio API sound synthesizer emitting high beep (success) or double low beep (error).
- **Toast & Session History**: Instant toast showing student name and status, with session log list of recent scans.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/scan/page.tsx
git commit -m "feat: add presensi siswa scanner page supporting RFID and QR Code"
```

---

### Task 7: Create Presensi Harian Page

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/harian/page.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/harian/page.tsx`**

Features:
- Calls `useLatestApelAttendanceQuery`.
- Date picker filter (defaults to today) & Rombel dropdown filter.
- Paginated table showing student name, NIPD, Rombel, time, and status badge.
- Delete attendance action (`useDeleteApelAttendanceMutation`) with confirmation dialog.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/harian/page.tsx
git commit -m "feat: add daily attendance page with date filter and delete action"
```

---

### Task 8: Create Monthly Rekap Page

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/rekap/page.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/rekap/page.tsx`**

Features:
- Calls `useMonthlyApelAttendanceQuery`.
- Rombel selector, Month & Year picker.
- Attendance matrix table displaying student list vs calendar days of month with status indicators.
- Summary counts for Hadir, Sakit, Izin, Alpa per student.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/rekap/page.tsx
git commit -m "feat: add monthly attendance rekap page by rombel"
```

---

### Task 9: Create Student History Page

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/riwayat/page.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/riwayat/page.tsx`**

Features:
- Calls `useStudentApelHistoryQuery`.
- Search & input for Student ID / NIS with Month/Year picker.
- Detailed timeline view or table of student's apel attendance records.

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/riwayat/page.tsx
git commit -m "feat: add student attendance history page"
```

---

### Task 10: Create Settings Page

**Files:**
- Create: `src/app/(authenticated)/presensi-siswa/pengaturan/page.tsx`

- [ ] **Step 1: Create `src/app/(authenticated)/presensi-siswa/pengaturan/page.tsx`**

Features:
- Calls `useOrbitSettingQuery` and `useUpdateOrbitSettingMutation`.
- Form to view & update `apel_time_start` (e.g. `07:00`).

- [ ] **Step 2: Commit**

```bash
git add src/app/(authenticated)/presensi-siswa/pengaturan/page.tsx
git commit -m "feat: add presensi siswa settings page"
```

---

### Task 11: Verification & Code Quality

**Files:**
- None (Run verification tools)

- [ ] **Step 1: Run linter**

Run: `bun run lint`
Expected: 0 lint errors.

- [ ] **Step 2: Run build**

Run: `bun run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 3: Commit remaining or fixes**

```bash
git commit -m "chore: verify presensi siswa build and linting"
```
