"use client";

import { Calendar, Clock, Lock, Save, Settings, ShieldAlert, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrbitSettingQuery, useUpdateOrbitSettingMutation } from "@/queries/useApelAttendanceQuery";
import { useAuth } from "@/store/useAuth";

interface DayConfig {
	key: string;
	label: string;
	openTime: string;
	closeTime: string;
	isHoliday: boolean;
}

const defaultWorkdays: DayConfig[] = [
	{ key: "senin", label: "Senin", openTime: "07:00", closeTime: "14:45", isHoliday: false },
	{ key: "selasa", label: "Selasa", openTime: "07:00", closeTime: "14:45", isHoliday: false },
	{ key: "rabu", label: "Rabu", openTime: "07:00", closeTime: "14:45", isHoliday: false },
	{ key: "kamis", label: "Kamis", openTime: "07:00", closeTime: "14:45", isHoliday: false },
	{ key: "jumat", label: "Jumat", openTime: "07:00", closeTime: "11:45", isHoliday: false },
	{ key: "sabtu", label: "Sabtu", openTime: "07:00", closeTime: "12:00", isHoliday: true },
	{ key: "minggu", label: "Minggu", openTime: "07:00", closeTime: "12:00", isHoliday: true },
];

export default function PresensiSiswaPengaturanPage() {
	const { user } = useAuth();
	const isAdmin =
		user?.roles?.some((r: any) => r.name?.toLowerCase() === "admin" || r.name?.toLowerCase() === "administrator") ||
		user?.type === 1;

	// Setting values
	const [timeOpen, setTimeOpen] = useState<string>("06:45");
	const [timeClose, setTimeClose] = useState<string>("18:00");
	const [timeStart, setTimeStart] = useState<string>("07:00");
	const [workdays, setWorkdays] = useState<DayConfig[]>(defaultWorkdays);

	const { data: openData, isLoading: isOpenLoading } = useOrbitSettingQuery("apel_time_open");
	const { data: closeData, isLoading: isCloseLoading } = useOrbitSettingQuery("apel_time_close");
	const { data: startData, isLoading: isStartLoading } = useOrbitSettingQuery("apel_time_start");
	const { data: workdaysData, isLoading: isWorkdaysLoading } = useOrbitSettingQuery("apel_workdays_config");

	const updateMutation = useUpdateOrbitSettingMutation();

	useEffect(() => {
		if (openData?.value) setTimeOpen(String(openData.value));
		if (closeData?.value) setTimeClose(String(closeData.value));
		if (startData?.value) setTimeStart(String(startData.value));
		if (workdaysData?.value) {
			try {
				const parsed = JSON.parse(String(workdaysData.value));
				if (Array.isArray(parsed) && parsed.length > 0) {
					setWorkdays(parsed);
				}
			} catch (_) {}
		}
	}, [openData, closeData, startData, workdaysData]);

	const isLoading = isOpenLoading || isCloseLoading || isStartLoading || isWorkdaysLoading;

	const handleDayToggleHoliday = (index: number, checked: boolean) => {
		const updated = [...workdays];
		updated[index].isHoliday = checked;
		setWorkdays(updated);
	};

	const handleDayTimeChange = (index: number, field: "openTime" | "closeTime", val: string) => {
		const updated = [...workdays];
		updated[index][field] = val;
		setWorkdays(updated);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await updateMutation.mutateAsync({ key: "apel_time_open", value: timeOpen });
			await updateMutation.mutateAsync({ key: "apel_time_close", value: timeClose });
			await updateMutation.mutateAsync({ key: "apel_time_start", value: timeStart });
			await updateMutation.mutateAsync({ key: "apel_workdays_config", value: JSON.stringify(workdays) });
			toast.success("Seluruh pengaturan presensi apel berhasil disimpan");
		} catch (err: any) {
			toast.error(err?.response?.data?.message || "Gagal menyimpan pengaturan");
		}
	};

	// Restrict access for non-admin users
	if (!isAdmin) {
		return (
			<Card className="shadow-xs max-w-xl mx-auto border-destructive/30 bg-destructive/5">
				<CardHeader className="text-center">
					<div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
						<ShieldAlert className="w-6 h-6" />
					</div>
					<CardTitle className="text-lg">Akses Ditolak</CardTitle>
					<CardDescription className="text-xs">
						Halaman Pengaturan Presensi hanya dapat diakses dan dikelola oleh Administrator Sekolah (Role Admin).
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<div className="space-y-6 max-w-4xl">
			<Card className="shadow-xs">
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Settings className="w-5 h-5 text-primary" />
							<CardTitle className="text-base">Pengaturan Jam Presensi & Operasional Apel</CardTitle>
						</div>
						<Badge variant="secondary" className="text-xs font-medium">
							<Lock className="w-3 h-3 mr-1 text-emerald-600" /> Admin Only
						</Badge>
					</div>
					<CardDescription className="text-xs">
						Konfigurasi jam buka/tutup presensi, batas waktu ketepatan apel pagi, serta jam operasional per hari.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-4">
							<Skeleton className="w-full h-12" />
							<Skeleton className="w-full h-12" />
							<Skeleton className="w-full h-24" />
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Section 1: Window Buka - Tutup & Cutoff Apel */}
							<div className="p-4 rounded-xl bg-muted/40 border space-y-4">
								<h3 className="font-semibold text-sm flex items-center gap-2">
									<Clock className="w-4 h-4 text-emerald-600" /> Waktu Buka - Tutup Presensi & Cutoff Apel
								</h3>
								<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
									{/* Jam Buka Presensi */}
									<div className="space-y-1.5">
										<label htmlFor="apel-time-open" className="text-xs font-medium text-muted-foreground">
											Jam Buka Presensi
										</label>
										<Input
											id="apel-time-open"
											type="time"
											value={timeOpen}
											onChange={(e) => setTimeOpen(e.target.value)}
											required
										/>
										<p className="text-[11px] text-muted-foreground">Waktu awal pemindai dibukanya presensi (Default: 06:45 WIB).</p>
									</div>

									{/* Jam Cutoff Apel (Batas Keterlambatan) */}
									<div className="space-y-1.5">
										<label htmlFor="apel-time-start" className="text-xs font-medium text-muted-foreground">
											Jam Cutoff Apel (Batas Terlambat)
										</label>
										<Input
											id="apel-time-start"
											type="time"
											value={timeStart}
											onChange={(e) => setTimeStart(e.target.value)}
											required
										/>
										<p className="text-[11px] text-muted-foreground">Acuan batas waktu hitung keterlambatan (Default: 07:00 WIB).</p>
									</div>

									{/* Jam Tutup Presensi */}
									<div className="space-y-1.5">
										<label htmlFor="apel-time-close" className="text-xs font-medium text-muted-foreground">
											Jam Tutup Presensi
										</label>
										<Input
											id="apel-time-close"
											type="time"
											value={timeClose}
											onChange={(e) => setTimeClose(e.target.value)}
											required
										/>
										<p className="text-[11px] text-muted-foreground">Batas akhir pemindai dikunci (Default: 18:00 WIB).</p>
									</div>
								</div>
							</div>

							{/* Section 2: Jam Operasional & Centang Hari Libur Per Hari */}
							<div className="p-4 rounded-xl bg-muted/40 border space-y-4">
								<h3 className="font-semibold text-sm flex items-center gap-2">
									<Calendar className="w-4 h-4 text-blue-600" /> Jam Operasional & Setting Hari Libur
								</h3>
								<div className="divide-y divide-border border rounded-lg overflow-hidden bg-card">
									{workdays.map((day, idx) => (
										<div key={day.key} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
											<div className="flex items-center gap-3 min-w-32">
												<div className="flex items-center space-x-2">
													<Checkbox
														id={`holiday-check-${day.key}`}
														checked={day.isHoliday}
														onCheckedChange={(checked) => handleDayToggleHoliday(idx, Boolean(checked))}
													/>
													<label
														htmlFor={`holiday-check-${day.key}`}
														className={`font-semibold cursor-pointer ${day.isHoliday ? "text-red-500 line-through" : ""}`}
													>
														{day.label}
													</label>
												</div>
												{day.isHoliday && (
													<Badge variant="destructive" className="text-[10px]">
														Libur
													</Badge>
												)}
											</div>

											<div className="flex items-center gap-3">
												<div className="flex items-center gap-1.5">
													<span className="text-muted-foreground text-[11px]">Jam Masuk:</span>
													<Input
														type="time"
														value={day.openTime}
														disabled={day.isHoliday}
														onChange={(e) => handleDayTimeChange(idx, "openTime", e.target.value)}
														className="h-8 w-28 text-xs"
													/>
												</div>
												<span className="text-muted-foreground">-</span>
												<div className="flex items-center gap-1.5">
													<span className="text-muted-foreground text-[11px]">Jam Pulang:</span>
													<Input
														type="time"
														value={day.closeTime}
														disabled={day.isHoliday}
														onChange={(e) => handleDayTimeChange(idx, "closeTime", e.target.value)}
														className="h-8 w-28 text-xs"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="flex justify-end">
								<Button type="submit" size="lg" disabled={updateMutation.isPending} className="font-semibold gap-2">
									<Save className="w-4 h-4" />
									{updateMutation.isPending ? "Menyimpan..." : "Simpan Seluruh Pengaturan"}
								</Button>
							</div>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
