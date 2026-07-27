"use client";

import { AlertCircle, Camera, CheckCircle2, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStoreApelAttendanceMutation } from "@/queries/useApelAttendanceQuery";
import type { ApelStudent } from "@/types/apel-attendance";

interface ScanLog {
	id: string;
	nis: string;
	timestamp: string;
	student?: ApelStudent;
	status: "success" | "error";
	message: string;
}

export default function PresensiSiswaScanPage() {
	const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
	const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
	const [rfidBuffer, setRfidBuffer] = useState<string>("");
	const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
	const [lastScannedStudent, setLastScannedStudent] = useState<{
		student?: ApelStudent;
		message: string;
		status: "success" | "error";
	} | null>(null);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const storeMutation = useStoreApelAttendanceMutation();

	// Native Web Audio API synth sound generator
	const playSound = (type: "success" | "error") => {
		if (!soundEnabled) return;
		try {
			const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			const ctx = new AudioContextClass();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			if (type === "success") {
				// High pitch success beep
				osc.type = "sine";
				osc.frequency.setValueAtTime(880, ctx.currentTime);
				gain.gain.setValueAtTime(0.1, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.25);
				osc.start(ctx.currentTime);
				osc.stop(ctx.currentTime + 0.25);
			} else {
				// Error double low beep
				osc.type = "square";
				osc.frequency.setValueAtTime(300, ctx.currentTime);
				gain.gain.setValueAtTime(0.15, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.35);
				osc.start(ctx.currentTime);
				osc.stop(ctx.currentTime + 0.35);
			}
		} catch (e) {
			console.error("Audio playback error:", e);
		}
	};

	const handleScanSubmit = async (nisCode: string) => {
		const cleanNis = nisCode.trim();
		if (!cleanNis || storeMutation.isPending) return;

		try {
			const result = await storeMutation.mutateAsync({ nis: cleanNis });
			playSound("success");
			toast.success(result.message || "Presensi berhasil dicatat!");

			const newLog: ScanLog = {
				id: Math.random().toString(36).substring(2, 9),
				nis: cleanNis,
				timestamp: new Date().toLocaleTimeString("id-ID"),
				student: result.student,
				status: "success",
				message: result.message,
			};

			setLastScannedStudent({
				student: result.student,
				message: result.message,
				status: "success",
			});
			setScanLogs((prev) => [newLog, ...prev]);
		} catch (err: any) {
			playSound("error");
			const errorMessage = err?.response?.data?.message || "Gagal mencatat presensi NIS";
			toast.error(errorMessage);

			const newLog: ScanLog = {
				id: Math.random().toString(36).substring(2, 9),
				nis: cleanNis,
				timestamp: new Date().toLocaleTimeString("id-ID"),
				status: "error",
				message: errorMessage,
			};

			setLastScannedStudent({
				message: errorMessage,
				status: "error",
			});
			setScanLogs((prev) => [newLog, ...prev]);
		}
	};

	// RFID Hardware USB Listener (listens for rapid keystrokes ending with Enter)
	useEffect(() => {
		let buffer = "";
		let timeoutId: NodeJS.Timeout;

		const handleKeyDown = (e: KeyboardEvent) => {
			// Ignore if target is inside form control if any exist elsewhere
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
				return;
			}

			if (e.key === "Enter") {
				if (buffer.trim().length > 0) {
					handleScanSubmit(buffer.trim());
					buffer = "";
					setRfidBuffer("");
				}
			} else if (e.key.length === 1) {
				buffer += e.key;
				setRfidBuffer(buffer);

				clearTimeout(timeoutId);
				timeoutId = setTimeout(() => {
					buffer = "";
					setRfidBuffer("");
				}, 500);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			clearTimeout(timeoutId);
		};
	}, [storeMutation.isPending]);

	// Camera Management for QR Code Scanning
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "environment" },
			});
			mediaStreamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
			setIsCameraActive(true);
		} catch (_err) {
			toast.error("Tidak dapat membuka kamera. Pastikan izin kamera telah diberikan.");
		}
	};

	const stopCamera = () => {
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((track) => track.stop());
			mediaStreamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		setIsCameraActive(false);
	};

	useEffect(() => {
		return () => {
			stopCamera();
		};
	}, []);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
			{/* Left Column: Pemindai RFID & QR Code Camera */}
			<div className="lg:col-span-7 space-y-6">
				{/* RFID USB Reader Status Card */}
				<Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 shadow-xs">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
								<CardTitle className="text-base text-blue-900 dark:text-blue-100">
									Pembaca RFID USB (Kartu Siswa)
								</CardTitle>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setSoundEnabled(!soundEnabled)}
								className="text-xs"
							>
								{soundEnabled ? (
									<>
										<Volume2 className="w-4 h-4 mr-1 text-emerald-600" /> Suara Aktif
									</>
								) : (
									<>
										<VolumeX className="w-4 h-4 mr-1 text-muted-foreground" /> Suara Mute
									</>
								)}
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<div className="p-4 text-center border-2 border-dashed border-blue-300 dark:border-blue-800 rounded-lg bg-background/80">
							<p className="font-semibold text-blue-900 dark:text-blue-200 text-sm">
								Tempelkan Kartu RFID Siswa pada Reader
							</p>
							<p className="text-muted-foreground text-xs mt-1">
								Sistem secara otomatis mendeteksi tap kartu tanpa menekan tombol apa pun.
							</p>

							{rfidBuffer && (
								<div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-mono rounded-full">
									<span>Membaca data RFID:</span>
									<span className="font-bold">{rfidBuffer}</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* QR Code Camera Scanner Card */}
				<Card className="shadow-xs">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Camera className="w-5 h-5 text-primary" />
								<CardTitle className="text-base">Pemindai QR Code Kamera</CardTitle>
							</div>
							<Button
								variant={isCameraActive ? "destructive" : "default"}
								size="sm"
								onClick={isCameraActive ? stopCamera : startCamera}
							>
								{isCameraActive ? "Tutup Kamera" : "Aktifkan Kamera QR"}
							</Button>
						</div>
						<CardDescription className="text-xs">
							Arahkan QR Code ID Card siswa ke area kamera di bawah ini
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isCameraActive ? (
							<div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
								<video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
								<div className="absolute inset-0 border-2 border-primary/60 border-dashed m-8 rounded-lg pointer-events-none flex items-center justify-center">
									<div className="w-full h-0.5 bg-red-500/80 animate-ping" />
								</div>
							</div>
						) : (
							<div className="py-12 text-center border-2 border-dashed rounded-lg bg-muted/30">
								<Camera className="w-10 h-10 mx-auto text-muted-foreground mb-2 opacity-50" />
								<p className="text-muted-foreground text-sm font-medium">Kamera Belum Aktif</p>
								<p className="text-muted-foreground text-xs mt-1">
									Klik tombol &quot;Aktifkan Kamera QR&quot; untuk mulai memindai QR Code.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Right Column: Active Result & Live Session Log */}
			<div className="lg:col-span-5 space-y-6">
				{/* Result Display Card */}
				<Card className="shadow-xs">
					<CardHeader className="pb-3">
						<CardTitle className="text-base">Hasil Scan Terakhir</CardTitle>
					</CardHeader>
					<CardContent>
						{lastScannedStudent ? (
							<div
								className={`p-4 rounded-lg border ${
									lastScannedStudent.status === "success"
										? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900"
										: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900"
								}`}
							>
								<div className="flex items-start gap-3">
									{lastScannedStudent.status === "success" ? (
										<CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
									) : (
										<AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
									)}
									<div>
										<h4
											className={`font-semibold text-base ${
												lastScannedStudent.status === "success"
													? "text-emerald-900 dark:text-emerald-100"
													: "text-red-900 dark:text-red-100"
											}`}
										>
											{lastScannedStudent.message}
										</h4>
										{lastScannedStudent.student && (
											<div className="mt-2 text-xs space-y-0.5 text-muted-foreground">
												<p>Nama: {lastScannedStudent.student.fullname}</p>
												<p>NIPD / NIS: {lastScannedStudent.student.nipd}</p>
												<p>ID Siswa: {lastScannedStudent.student.student_id}</p>
											</div>
										)}
									</div>
								</div>
							</div>
						) : (
							<div className="py-8 text-center text-muted-foreground text-sm border border-dashed rounded-md">
								Belum ada scan yang dilakukan dalam sesi ini
							</div>
						)}
					</CardContent>
				</Card>

				{/* Session Logs List */}
				<Card className="shadow-xs">
					<CardHeader className="pb-3 flex flex-row items-center justify-between">
						<CardTitle className="text-base">Riwayat Scan Sesi Ini</CardTitle>
						<Badge variant="outline" className="text-xs">
							{scanLogs.length} Data
						</Badge>
					</CardHeader>
					<CardContent>
						{scanLogs.length === 0 ? (
							<div className="py-6 text-center text-muted-foreground text-xs">Riwayat scan kosong.</div>
						) : (
							<div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
								{scanLogs.map((log) => (
									<div
										key={log.id}
										className="p-3 border rounded-md text-xs flex items-center justify-between bg-card"
									>
										<div>
											<p className="font-semibold">{log.student?.fullname || `NIS: ${log.nis}`}</p>
											<p className="text-muted-foreground text-[11px]">{log.message}</p>
										</div>
										<div className="text-right shrink-0 ml-2">
											<Badge
												variant={log.status === "success" ? "default" : "destructive"}
												className="text-[10px]"
											>
												{log.status === "success" ? "Hadir" : "Gagal"}
											</Badge>
											<p className="text-muted-foreground text-[10px] mt-1">{log.timestamp}</p>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
