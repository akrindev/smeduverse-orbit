"use client";

import { Clock, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrbitSettingQuery, useUpdateOrbitSettingMutation } from "@/queries/useApelAttendanceQuery";

export default function PresensiSiswaPengaturanPage() {
	const [startTime, setStartTime] = useState<string>("07:00");

	const { data: settingData, isLoading } = useOrbitSettingQuery("apel_time_start");
	const updateMutation = useUpdateOrbitSettingMutation();

	useEffect(() => {
		if (settingData?.value) {
			setStartTime(String(settingData.value));
		}
	}, [settingData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!startTime.trim()) return;

		try {
			const res = await updateMutation.mutateAsync({
				key: "apel_time_start",
				value: startTime.trim(),
			});
			toast.success(res.message || "Pengaturan berhasil diperbarui");
		} catch (err: any) {
			toast.error(err?.response?.data?.message || "Gagal memperbarui pengaturan");
		}
	};

	return (
		<div className="space-y-6 max-w-2xl">
			<Card className="shadow-xs">
				<CardHeader>
					<div className="flex items-center gap-2">
						<Settings className="w-5 h-5 text-primary" />
						<CardTitle className="text-base">Pengaturan Jam Apel Pagi</CardTitle>
					</div>
					<CardDescription className="text-xs">
						Kelola pengaturan konfigurasi batas jam masuk apel harian siswa
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="space-y-4">
							<Skeleton className="w-full h-10" />
							<Skeleton className="w-24 h-9" />
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-1.5">
								<label htmlFor="apel-time-input" className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
									<Clock className="w-3.5 h-3.5" /> Jam Mulai Apel (HH:MM)
								</label>
								<Input
									id="apel-time-input"
									type="time"
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
									className="max-w-xs"
									required
								/>
								<p className="text-xs text-muted-foreground">
									Jam ini digunakan sebagai acuan batas kehadiran apel pagi siswa.
								</p>
							</div>

							<Button type="submit" disabled={updateMutation.isPending}>
								<Save className="w-4 h-4 mr-2" />
								{updateMutation.isPending ? "Menyimpan..." : "Simpan Pengaturan"}
							</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
