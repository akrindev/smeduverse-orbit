"use client";

import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import {
	AlertCircle,
	Camera,
	CheckCircle2,
	Clock,
	Maximize,
	Minimize,
	QrCode,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function PresensiSiswaScanPage() {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuthQuery();
	const devices = useDevices();

	const [isMounted, setIsMounted] = useState<boolean>(false);
	const [currentTime, setCurrentTime] = useState<Date>(new Date());
	const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
	const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
	const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
	const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
	const [rfidBuffer, setRfidBuffer] = useState<string>("");
	const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);
	const [lastScannedResult, setLastScannedResult] = useState<{
		student?: ApelStudent;
		message: string;
		status: "success" | "error";
		timestamp: string;
	} | null>(null);

	const lastQrScanRef = useRef<{ code: string; time: number }>({ code: "", time: 0 });
	const storeMutation = useStoreApelAttendanceMutation();

	// Today's summary data
	const todayDate = new Date().toISOString().split("T")[0];
	const { data: latestAttendanceData, refetch: refetchLatest } = useLatestApelAttendanceQuery({ date: todayDate });

	// Authentication Gate
	useEffect(() => {
		if (!authLoading && !isAuthenticated) {
			router.push("/login");
		}
	}, [isAuthenticated, authLoading, router]);

	// Live Clock Timer & Mount Check
	useEffect(() => {
		setIsMounted(true);
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Native Web Audio API Sound Synthesizer
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
				osc.frequency.setValueAtTime(260, ctx.currentTime);
				gain.gain.setValueAtTime(0.2, ctx.currentTime);
				gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
				osc.start(ctx.currentTime);
				osc.stop(ctx.currentTime + 0.4);
			}
		} catch (e) {
			console.error("Audio synth error:", e);
		}
	};

	// Process Scan Submission (RFID or QR)
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

	// QR Code Handler
	const handleQrScan = (result: Array<{ rawValue: string }>) => {
		if (result && result.length > 0) {
			const scannedText = result[0].rawValue;
			const now = Date.now();

			if (
				scannedText === lastQrScanRef.current.code &&
				now - lastQrScanRef.current.time < 2000
			) {
				return;
			}

			lastQrScanRef.current = { code: scannedText, time: now };
			handleScanSubmit(scannedText);
		}
	};

	// Custom Green Canvas Tracker for detected barcode box
	const customGreenTracker = (detectedCodes: any[], ctx: CanvasRenderingContext2D) => {
		detectedCodes.forEach((code) => {
			const { boundingBox } = code;
			if (boundingBox) {
				ctx.strokeStyle = "#10b981"; // Emerald green
				ctx.lineWidth = 4;
				ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
			}
		});
	};

	// RFID USB Reader Listener (Continuous background keystrokes)
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
		<div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
			{/* CSS override for @yudiel/react-qr-scanner finder colors and animated laser beam */}
			<style>{`
				@keyframes greenLaserMove {
					0% { top: 5%; opacity: 0.8; }
					50% { top: 92%; opacity: 1; }
					100% { top: 5%; opacity: 0.8; }
				}

				.green-qr-scanner-wrap div {
					border-color: #10b981 !important;
				}

				/* Animate laser beam inside finder box */
				.green-qr-scanner-wrap div[style*="width: 70%"],
				.green-qr-scanner-wrap div[style*="width:70%"] {
					position: relative !important;
				}

				.green-qr-scanner-wrap div[style*="width: 70%"]::after,
				.green-qr-scanner-wrap div[style*="width:70%"]::after {
					content: '';
					position: absolute;
					left: 4%;
					right: 4%;
					height: 3px;
					background: linear-gradient(90deg, transparent, #10b981, #34d399, #10b981, transparent);
					box-shadow: 0 0 15px #10b981, 0 0 6px #34d399;
					border-radius: 9999px;
					animation: greenLaserMove 2.2s ease-in-out infinite;
					z-index: 25;
					pointer-events: none;
				}
			`}</style>

			{/* Top Header Bar */}
			<header className="px-6 py-3.5 border-b bg-card shadow-xs flex items-center justify-between sticky top-0 z-50">
				<div className="flex items-center gap-3">
					<Link href="/presensi-siswa" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
						<Image src="/orbit.png" width={32} height={32} alt="Orbit Logo" />
						<div>
							<h1 className="font-bold text-base leading-tight tracking-tight">Presensi Apel Siswa</h1>
							<p className="text-[11px] text-muted-foreground">Smeduverse Orbit Station</p>
						</div>
					</Link>
				</div>

				{/* Center: RFID Status Badge / Bubble Indicator */}
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 px-3 py-1.5 rounded-full text-xs text-emerald-700 dark:text-emerald-300">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
						</span>
						<span className="font-medium">RFID Active</span>
						<Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ml-0.5" />
					</div>

					{/* Live RFID Buffer Pill */}
					{rfidBuffer && (
						<Badge
							variant="outline"
							className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 text-xs animate-pulse"
						>
							<Wifi className="w-3 h-3 mr-1" /> Tap: {rfidBuffer}
						</Badge>
					)}
				</div>

				{/* Right: Date, Live Clock & Actions */}
				<div className="flex items-center gap-2">
					<div className="hidden md:flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-md text-xs font-mono">
						<Clock className="w-3.5 h-3.5 text-primary" />
						<span>
							{isMounted ? (
								<>
									<span className="font-semibold mr-1.5">
										{currentTime.toLocaleDateString("id-ID", {
											weekday: "long",
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
									<span className="text-primary font-bold">
										{currentTime.toLocaleTimeString("id-ID", {
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
									</span>
								</>
							) : (
								"--:--:--"
							)}
						</span>
					</div>

					<Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
						{soundEnabled ? (
							<Volume2 className="w-4 h-4 text-emerald-600" />
						) : (
							<VolumeX className="w-4 h-4 text-muted-foreground" />
						)}
					</Button>
					<Button variant="outline" size="sm" onClick={toggleFullscreen}>
						{isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
					</Button>
				</div>
			</header>

			{/* Main Layout Body */}
			<main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl w-full mx-auto items-start">
				{/* Left / Primary QR Scanner Section (With Margins & Animated Green Laser Finder) */}
				<div className="lg:col-span-7 flex flex-col space-y-4">
					{/* Toolbar: Camera Selection & Toggle */}
					<div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-card border rounded-xl shadow-xs">
						<div className="flex items-center gap-2">
							<QrCode className="w-4 h-4 text-primary" />
							<span className="text-xs font-bold">Pemindai QR Code</span>
						</div>

						<div className="flex items-center gap-2">
							{/* Camera Select Dropdown */}
							{devices && devices.length > 0 && (
								<Select
									value={selectedDeviceId || "default"}
									onValueChange={(val) => setSelectedDeviceId(val === "default" ? undefined : val)}
								>
									<SelectTrigger className="h-8 text-xs w-[180px]">
										<SelectValue placeholder="Pilih Kamera" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="default">Kamera Default</SelectItem>
										{devices.map((device, i) => (
											<SelectItem key={device.deviceId} value={device.deviceId}>
												{device.label || `Kamera ${i + 1}`}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}

							<Button
								variant={isCameraActive ? "outline" : "default"}
								size="sm"
								className="h-8 text-xs"
								onClick={() => setIsCameraActive(!isCameraActive)}
							>
								<Camera className="w-3.5 h-3.5 mr-1" />
								{isCameraActive ? "Nonaktifkan" : "Aktifkan"}
							</Button>
						</div>
					</div>

					{/* Outer Padded Card Container for Margin & Spacing */}
					<div className="p-4 sm:p-5 bg-card border rounded-2xl shadow-md">
						{/* 1:1 Aspect Ratio Scanner Container */}
						<div className="green-qr-scanner-wrap w-full aspect-square max-h-[480px] bg-black rounded-xl overflow-hidden shadow-inner border-2 border-emerald-500/30 relative flex items-center justify-center mx-auto">
							{isCameraActive ? (
								<>
									<Scanner
										onScan={handleQrScan}
										onError={(err) => console.log("QR Scanner info:", err)}
										scanDelay={2000}
										allowMultiple={false}
										components={{
											finder: true,
											torch: true,
											zoom: true,
											tracker: customGreenTracker,
										}}
										constraints={{
											deviceId: selectedDeviceId,
											facingMode: selectedDeviceId ? undefined : "environment",
										}}
										styles={{
											container: { width: "100%", height: "100%", aspectRatio: "1 / 1" },
											video: { width: "100%", height: "100%", objectFit: "cover" },
										}}
									/>

									<div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 z-10 border border-white/10">
										<span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
										<span>Scanner Animated Green</span>
									</div>
								</>
							) : (
								<div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-950">
									<Camera className="w-12 h-12 mb-3 text-slate-600" />
									<p className="font-semibold text-sm text-slate-200">Kamera Nonaktif</p>
									<p className="text-xs text-slate-500 mt-1 max-w-xs">
										Klik tombol &quot;Aktifkan&quot; di atas untuk menyalakan kamera.
									</p>
									<Button size="sm" className="mt-4" onClick={() => setIsCameraActive(true)}>
										Nyalakan Kamera
									</Button>
								</div>
							)}
						</div>

						{/* Footnote info for RFID */}
						<div className="mt-4 p-3 bg-muted/40 rounded-lg border text-xs flex items-center justify-between text-muted-foreground">
							<div className="flex items-center gap-2">
								<Zap className="w-4 h-4 text-emerald-600 shrink-0" />
								<span>Sensor RFID USB aktif di latar belakang (otomatis deteksi kartu tap)</span>
							</div>
							<Badge variant="secondary" className="text-[10px]">
								Auto Tap
							</Badge>
						</div>
					</div>
				</div>

				{/* Right Section: Student Scan Result Banner & Session Activity */}
				<div className="lg:col-span-5 flex flex-col space-y-6">
					{/* Result Banner Card */}
					<Card className="shadow-md">
						<CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
							<CardTitle className="text-base">Hasil Scan Terakhir</CardTitle>
							{lastScannedResult && (
								<span className="text-xs font-mono text-muted-foreground">
									{lastScannedResult.timestamp}
								</span>
							)}
						</CardHeader>
						<CardContent className="pt-4">
							{lastScannedResult ? (
								<div
									className={`p-4 rounded-lg border ${
										lastScannedResult.status === "success"
											? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
											: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
									}`}
								>
									<div className="flex items-start gap-3">
										{lastScannedResult.status === "success" ? (
											<CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
										) : (
											<AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
										)}
										<div className="flex-1">
											<h3
												className={`font-bold text-base ${
													lastScannedResult.status === "success"
														? "text-emerald-900 dark:text-emerald-100"
														: "text-red-900 dark:text-red-100"
												}`}
											>
												{lastScannedResult.message}
											</h3>
											{lastScannedResult.student && (
												<div className="mt-2 text-xs space-y-1 text-muted-foreground border-t pt-2">
													<p>
														<span className="font-semibold text-foreground">Siswa:</span>{" "}
														{lastScannedResult.student.fullname}
													</p>
													<p>
														<span className="font-semibold text-foreground">NIPD / NIS:</span>{" "}
														{lastScannedResult.student.nipd}
													</p>
													<p>
														<span className="font-semibold text-foreground">ID Siswa:</span>{" "}
														{lastScannedResult.student.student_id}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							) : (
								<div className="py-10 text-center text-muted-foreground text-sm border border-dashed rounded-md">
									Belum ada data scan pada sesi pemindaian ini
								</div>
							)}
						</CardContent>
					</Card>

					{/* Live Session Log List */}
					<Card className="shadow-xs flex-1">
						<CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-base">Aktivitas Sesi Presensi</CardTitle>
								<CardDescription className="text-xs">
									Total Terdaftar Hari Ini: {latestAttendanceData?.attendances?.total ?? 0} Siswa
								</CardDescription>
							</div>
							<Badge variant="outline" className="text-xs">
								{scanLogs.length} Scan
							</Badge>
						</CardHeader>
						<CardContent className="pt-4">
							{scanLogs.length === 0 ? (
								<div className="py-8 text-center text-muted-foreground text-xs">
									Belum ada aktivitas scan.
								</div>
							) : (
								<div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
									{scanLogs.map((log) => (
										<div
											key={log.id}
											className="p-3 border rounded-lg text-xs flex items-center justify-between bg-card"
										>
											<div>
												<p className="font-bold border-b-0">
													{log.student?.fullname || `NIS: ${log.nis}`}
												</p>
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
			</main>
		</div>
	);
}
