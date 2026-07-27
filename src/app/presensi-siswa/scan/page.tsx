"use client";

import {
	AlertCircle,
	ArrowLeft,
	Camera,
	CheckCircle2,
	Clock,
	Maximize,
	Minimize,
	QrCode,
	Sparkles,
	Volume2,
	VolumeX,
	Wifi,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { useLatestApelAttendanceQuery, useStoreApelAttendanceMutation } from "@/queries/useApelAttendanceQuery";
import type { ApelStudent } from "@/types/apel-attendance";

interface ScanLog {
	id: string;
	nis: string;
	timestamp: string;
	student?: ApelStudent;
	status: "success" | "error";
	message: string;
}

export default function PresensiSiswaStandaloneScanPage() {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuthQuery();

	const [currentTime, setCurrentTime] = useState<Date>(new Date());
	const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
	const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
	const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
	const [rfidBuffer, setRfidBuffer] = useState<string>("");
	const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
	const [lastScannedResult, setLastScannedResult] = useState<{
		student?: ApelStudent;
		message: string;
		status: "success" | "error";
		timestamp: string;
	} | null>(null);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const storeMutation = useStoreApelAttendanceMutation();

	// Today's summary count
	const todayDate = new Date().toISOString().split("T")[0];
	const { data: latestAttendanceData, refetch: refetchLatest } = useLatestApelAttendanceQuery({ date: todayDate });

	// Authentication Gate
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, authLoading, router]);

	// Live Clock Timer
	useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Web Audio API Sound Synthesizer
	const playSound = (type: "success" | "error") => {
		if (!soundEnabled) return;
		try {
			const AudioContextClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			const ctx = new AudioContextClass();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			if (type === "success") {
				osc.type = "sine";
				osc.frequency.setValueAtTime(880, ctx.currentTime);
				gain.gain.setValueAtTime(0.15, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);
				osc.start(ctx.currentTime);
				osc.stop(ctx.currentTime + 0.3);
			} else {
				osc.type = "square";
				osc.frequency.setValueAtTime(250, ctx.currentTime);
				gain.gain.setValueAtTime(0.2, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
				osc.start(ctx.currentTime);
				osc.stop(ctx.currentTime + 0.4);
			}
		} catch (e) {
			console.error("Audio synth error:", e);
		}
	};

	// Process Scan Submission
	const handleScanSubmit = async (nisCode: string) => {
		const cleanNis = nisCode.trim();
		if (!cleanNis || storeMutation.isPending) return;

		const timeStr = new Date().toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});

		try {
			const result = await storeMutation.mutateAsync({ nis: cleanNis });
			playSound("success");
			toast.success(result.message || "Presensi berhasil dicatat!");

			const newLog: ScanLog = {
				id: Math.random().toString(36).substring(2, 9),
				nis: cleanNis,
				timestamp: timeStr,
				student: result.student,
				status: "success",
				message: result.message,
			};

			setLastScannedResult({
				student: result.student,
				message: result.message,
				status: "success",
				timestamp: timeStr,
			});
			setScanLogs((prev) => [newLog, ...prev]);
			refetchLatest();
		} catch (err: any) {
			playSound("error");
			const errorMessage = err?.response?.data?.message || "NIS tidak ditemukan atau gagal dicatat";
			toast.error(errorMessage);

			const newLog: ScanLog = {
				id: Math.random().toString(36).substring(2, 9),
				nis: cleanNis,
				timestamp: timeStr,
				status: "error",
				message: errorMessage,
			};

			setLastScannedResult({
				message: errorMessage,
				status: "error",
				timestamp: timeStr,
			});
			setScanLogs((prev) => [newLog, ...prev]);
		}
	};

	// RFID USB Reader Keyboard Listener
	useEffect(() => {
		let buffer = "";
		let timeoutId: NodeJS.Timeout;

		const handleKeyDown = (e: KeyboardEvent) => {
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

	// Camera Management for QR Scanning
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
			toast.error("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
		}
	};

	const stopCamera = () => {
		if (mediaStreamRef.current) {
			mediaStreamRef.current.getTracks().forEach((t) => t.stop());
			mediaStreamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		setIsCameraActive(false);
	};

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
		} else {
			document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
		}
	};

	if (authLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-background p-6">
				<Skeleton className="w-96 h-48" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600">
			{/* Kiosk Header */}
			<header className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
				<div className="flex items-center gap-4">
					<Link href="/presensi-siswa" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
						<Image src="/orbit.png" width={36} height={36} alt="Orbit Logo" />
						<div className="hidden sm:block">
							<h1 className="font-bold text-lg leading-tight tracking-wide text-white">SMEDUVERSE ORBIT</h1>
							<p className="text-xs text-blue-400 font-medium">Stasiun Presensi Apel Siswa</p>
						</div>
					</Link>
				</div>

				{/* Center Live Clock */}
				<div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700">
					<Clock className="w-4 h-4 text-blue-400 animate-pulse" />
					<span className="font-mono text-sm sm:text-base font-semibold text-slate-100">
						{currentTime.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })}
					</span>
					<span className="font-mono text-sm sm:text-base font-bold text-blue-400 ml-1">
						{currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
					</span>
				</div>

				{/* Header Actions */}
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setSoundEnabled(!soundEnabled)}
						className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
					>
						{soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={toggleFullscreen}
						className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
					>
						{isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
					</Button>
					<Link href="/presensi-siswa">
						<Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
							<ArrowLeft className="w-4 h-4 mr-1.5" /> Dashboard
						</Button>
					</Link>
				</div>
			</header>

			{/* Main Kiosk Content Body */}
			<main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1600px] w-full mx-auto">
				{/* Left Column: Big RFID & QR Scanner Station */}
				<div className="lg:col-span-7 flex flex-col space-y-6">
					{/* Big Interactive Tap Zone */}
					<div className="relative bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/40 border-2 border-blue-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl overflow-hidden min-h-[340px]">
						{/* Animated Background Ring */}
						<div className="absolute w-72 h-72 rounded-full border border-blue-500/20 animate-ping pointer-events-none" />
						<div className="absolute w-96 h-96 rounded-full border border-indigo-500/10 pointer-events-none" />

						<div className="relative z-10 space-y-4">
							<div className="w-20 h-20 mx-auto rounded-full bg-blue-600/20 border-2 border-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20 animate-pulse">
								<Zap className="w-10 h-10 text-blue-400" />
							</div>

							<div className="space-y-1">
								<h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
									TEMPELKAN KARTU RFID SISWA
								</h2>
								<p className="text-slate-400 text-sm max-w-md mx-auto">
									Dekatkan Kartu Tanda Siswa pada alat pembaca RFID USB. Sistem otomatis mencatat presensi tanpa input manual.
								</p>
							</div>

							{/* Active Buffer Status */}
							{rfidBuffer ? (
								<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-300 font-mono text-sm animate-pulse">
									<Wifi className="w-4 h-4 text-blue-400" />
									<span>Membaca RFID: <strong className="text-white">{rfidBuffer}</strong></span>
								</div>
							) : (
								<div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-full text-xs">
									<span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
									<span>Sensor RFID Siap Melayani Scan</span>
								</div>
							)}
						</div>
					</div>

					{/* QR Code Scanner Toggle Section */}
					<Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg">
						<CardHeader className="pb-3 flex flex-row items-center justify-between">
							<div className="flex items-center gap-2">
								<QrCode className="w-5 h-5 text-blue-400" />
								<div>
									<CardTitle className="text-base text-white">Pemindai QR Code Kamera</CardTitle>
									<CardDescription className="text-xs text-slate-400">
										Gunakan kamera jika siswa membawa cetakan/aplikasi QR Code
									</CardDescription>
								</div>
							</div>
							<Button
								variant={isCameraActive ? "destructive" : "outline"}
								size="sm"
								onClick={isCameraActive ? stopCamera : startCamera}
								className={isCameraActive ? "" : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"}
							>
								{isCameraActive ? "Tutup Kamera" : "Buka Kamera QR"}
							</Button>
						</CardHeader>
						<CardContent>
							{isCameraActive ? (
								<div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-slate-700 flex items-center justify-center">
									<video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
									<div className="absolute inset-0 border-2 border-blue-400/60 border-dashed m-10 rounded-lg pointer-events-none flex items-center justify-center">
										<div className="w-full h-0.5 bg-red-500/80 animate-ping" />
									</div>
								</div>
							) : (
								<div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
									Kamera nonaktif. Klik &quot;Buka Kamera QR&quot; untuk mengaktifkan pemindaian berbasis kamera.
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Right Column: Instant Student Result & Live Session Log */}
				<div className="lg:col-span-5 flex flex-col space-y-6">
					{/* Instant Popup / Banner Card */}
					<Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl overflow-hidden">
						<CardHeader className="bg-slate-800/50 pb-3 border-b border-slate-800">
							<div className="flex items-center justify-between">
								<CardTitle className="text-sm font-semibold text-slate-300">Hasil Scan Terakhir</CardTitle>
								{lastScannedResult && (
									<span className="text-xs font-mono text-slate-400">{lastScannedResult.timestamp}</span>
								)}
							</div>
						</CardHeader>
						<CardContent className="pt-6">
							{lastScannedResult ? (
								<div
									className={`p-6 rounded-xl border flex flex-col items-center text-center space-y-4 ${
										lastScannedResult.status === "success"
											? "bg-emerald-950/30 border-emerald-500/40 text-emerald-100"
											: "bg-red-950/30 border-red-500/40 text-red-100"
									}`}
								>
									{lastScannedResult.status === "success" ? (
										<div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
											<CheckCircle2 className="w-10 h-10" />
										</div>
									) : (
										<div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/20">
											<AlertCircle className="w-10 h-10" />
										</div>
									)}

									<div className="space-y-1">
										<h3 className="text-xl font-extrabold tracking-tight">
											{lastScannedResult.student?.fullname || lastScannedResult.message}
										</h3>
										<p className="text-sm text-slate-300 font-medium">{lastScannedResult.message}</p>
									</div>

									{lastScannedResult.student && (
										<div className="w-full bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs grid grid-cols-2 gap-2 text-left">
											<div>
												<span className="text-slate-500 block">NIPD / NIS</span>
												<span className="font-semibold text-white">{lastScannedResult.student.nipd}</span>
											</div>
											<div>
												<span className="text-slate-500 block">ID Siswa</span>
												<span className="font-semibold text-white">{lastScannedResult.student.student_id}</span>
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
									Belum ada data scan pada sesi stasiun ini
								</div>
							)}
						</CardContent>
					</Card>

					{/* Live Session Activity Log */}
					<Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-lg flex-1">
						<CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-sm font-semibold text-slate-300">Aktivitas Scan Sesi Ini</CardTitle>
								<CardDescription className="text-xs text-slate-500">
									Total Hadir Hari Ini: {latestAttendanceData?.attendances?.total ?? 0} Siswa
								</CardDescription>
							</div>
							<Badge variant="outline" className="border-slate-700 text-slate-300 text-xs">
								{scanLogs.length} Entri
							</Badge>
						</CardHeader>
						<CardContent className="pt-4">
							{scanLogs.length === 0 ? (
								<div className="py-8 text-center text-slate-500 text-xs">Riwayat pemindaian kosong.</div>
							) : (
								<div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
									{scanLogs.map((log) => (
										<div
											key={log.id}
											className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs flex items-center justify-between"
										>
											<div>
												<p className="font-bold text-slate-200">{log.student?.fullname || `NIS: ${log.nis}`}</p>
												<p className="text-slate-400 text-[11px]">{log.message}</p>
											</div>
											<div className="text-right">
												<Badge
													className={
														log.status === "success"
															? "bg-emerald-950 text-emerald-300 border-emerald-800 text-[10px]"
															: "bg-red-950 text-red-300 border-red-800 text-[10px]"
													}
												>
													{log.status === "success" ? "Hadir" : "Gagal"}
												</Badge>
												<p className="text-slate-500 text-[10px] mt-1">{log.timestamp}</p>
											</div>
										</div>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
