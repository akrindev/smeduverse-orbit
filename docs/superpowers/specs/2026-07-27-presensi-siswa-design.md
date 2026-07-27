# Design Spec: Presensi Siswa (Apel Attendance)

**Date**: 2026-07-27  
**Branch**: `feature/presensi-siswa`  
**Target Roles**: `guru`, `admin`  

---

## 1. Overview
Fitur **Presensi Siswa** dirancang untuk mencatat dan mengelola kehadiran apel harian siswa menggunakan pemindai QR Code (kamera) dan pembaca Kartu RFID (USB reader), tanpa input manual.

Fitur ini diakses melalui **Sidebar** dan **Quick Menu** pada dashboard aplikasi Smeduverse Orbit.

---

## 2. Navigation & Architecture

### Menu Registration
- File: `src/app/(authenticated)/components/menu-list.ts`
- Item: `{ name: "Presensi Siswa", title: "Presensi Siswa", icon: IconUserCheck, path: "/presensi-siswa", roles: ["guru", "admin"] }`

### Page & Sub-route Structure (`/presensi-siswa`)
Menggunakan shared top navbar pada `src/app/(authenticated)/presensi-siswa/layout.tsx`:

1. **Dashboard Hub** (`/presensi-siswa`)
   - Kartu navigasi ke sub-fitur.
   - Ringkasan statistik presensi hari ini.

2. **Scanner Presensi** (`/presensi-siswa/scan`)
   - **Pemindai RFID**: Auto-focus reader receiver yang menangkap ketikan otomatis dari pembaca RFID USB dan langsung mengirim data NIS saat tombol `Enter` terdeteksi.
   - **Pemindai QR Code**: Pemindai berbasis kamera menggunakan webcam/kamera HP.
   - **Tanpa Input Manual**: Hanya menerima input otomatis dari RFID reader atau QR scanner.
   - **Indikator Respons**: Toast notifikasi real-time & sinyal audio beeping (Web Audio API synth success/error beep).
   - **Log Sesi**: Tabel riwayat pemindaian sesi saat ini.

3. **Presensi Harian** (`/presensi-siswa/harian`)
   - Memanggil `GET /orbit/api/attendance/apel/latest`.
   - Filter tanggal & Rombel.
   - Hapus data presensi via `DELETE /orbit/api/attendance/apel/delete/{id}` (khusus role Guru & Admin).

4. **Rekap Bulanan** (`/presensi-siswa/rekap`)
   - Memanggil `GET /orbit/api/attendance/apel/month`.
   - Matriks kehadiran harian per siswa dalam 1 Rombel untuk bulan tertentu.

5. **Riwayat Siswa** (`/presensi-siswa/riwayat`)
   - Memanggil `GET /orbit/api/attendance/apel/student`.
   - Riwayat presensi individu siswa berdasarkan `student_id`, `month`, dan `year`.

6. **Pengaturan** (`/presensi-siswa/pengaturan`)
   - Memanggil `GET /orbit/api/attendance/setting/get` dan `PUT /orbit/api/attendance/setting/update`.
   - Mengatur konfigurasi `orbit_settings` seperti jam masuk/mulai apel (`apel_time_start`).

---

## 3. Data Model & React Query Hooks

### Types (`src/types/apel-attendance.ts`)
- `ApelAttendance`: Representasi record kehadiran (`id`, `student_id`, `rombongan_belajar_id`, `attendance_type`, `attendance_status`, `attendance_date`, `student`, `rombel`).
- `ApelStoreResponse`, `ApelLatestResponse`, `ApelMonthlyResponse`, `ApelStudentHistoryResponse`, `OrbitSettingResponse`.

### React Query Hooks (`src/queries/useApelAttendanceQuery.ts`)
- `useStoreApelAttendanceMutation`: `POST /orbit/api/attendance/apel/store`
- `useLatestApelAttendanceQuery`: `GET /orbit/api/attendance/apel/latest`
- `useMonthlyApelAttendanceQuery`: `GET /orbit/api/attendance/apel/month`
- `useStudentApelHistoryQuery`: `GET /orbit/api/attendance/apel/student`
- `useDeleteApelAttendanceMutation`: `DELETE /orbit/api/attendance/apel/delete/{id}`
- `useOrbitSettingQuery`: `GET /orbit/api/attendance/setting/get`
- `useUpdateOrbitSettingMutation`: `PUT /orbit/api/attendance/setting/update`

---

## 4. Verification & Testing
- Memastikan menu Presensi Siswa muncul di Sidebar dan Quick Menu untuk role `guru` dan `admin`.
- Memastikan pemindai RFID dan QR Code berfungsi mengirim `POST /orbit/api/attendance/apel/store` tanpa butuh input manual.
- Memastikan pemrosesan status response (201 Hadir, 404 NIS tidak ditemukan, 400 Tanpa rombel, 409 Sudah hadir) menampilkan pesan toast & audio beep yang tepat.
- Menjalankan build linting (`bun run lint` / `bun run build`).
