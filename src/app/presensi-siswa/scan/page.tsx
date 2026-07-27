"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import {
	Activity,
	AlertCircle,
	BadgeCheck,
	Calendar,
	Camera,
	CheckCircle2,
	Clock,
	Flame,
	GraduationCap,
	Maximize,
	Minimize,
	Moon,
	QrCode,
	ShieldCheck,
	Sparkles,
	Sun,
	User,
	Volume2,
	VolumeX,
	Wifi,
	XCircle,
	Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import {
	useLatestApelAttendanceQuery,
	useOrbitSettingQuery,
	useStoreApelAttendanceMutation,
} from "@/queries/useApelAttendanceQuery";
import type { ApelStudent } from "@/types/apel-attendance";

interface ScanLog {
	id: string;
	nis: string;
	timestamp: string;
	student?: ApelStudent;
	rombelName?: string;
	status: "success" | "error";
	message: string;
	createdAt?: string;
}

export default function PresensiSiswaScanPage() {
	const router = useRouter();
	const { isAuthenticated, isLoading: authLoading } = useAuthQuery();
	const { theme, setTheme } = useTheme();
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
		rombelName?: string;
		message: string;
		status: "success" | "error";
		timestamp: string;
		createdAt?: string;
	} | null>(null);

	const lastQrScanRef = useRef<{ code: string; time: number }>({ code: "", time: 0 });
	const storeMutation = useStoreApelAttendanceMutation();

	// Today's summary data & settings
	const todayDate = new Date().toISOString().split("T")[0];
	const { data: latestAttendanceData, refetch: refetchLatest } = useLatestApelAttendanceQuery({ date: todayDate });
	const { data: settingData } = useOrbitSettingQuery("apel_time_start");
	const { data: workdaysData } = useOrbitSettingQuery("apel_workdays_config");

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

	// Auto-hydrate scanLogs and lastScannedResult from latestAttendanceData when visiting/re-visiting page
	useEffect(() => {
		if (latestAttendanceData?.attendances?.data?.length) {
			const items = latestAttendanceData.attendances.data;

			if (scanLogs.length === 0) {
				const initialLogs: ScanLog[] = items.map((item) => {
					const timeStr = item.created_at
						? new Date(item.created_at).toLocaleTimeString("id-ID", {
								hour: "2-digit",
								minute: "2-digit",
							}) + " WIB"
						: "--:-- WIB";

					return {
						id: String(item.id),
						nis: item.student?.nipd || item.student_id,
						timestamp: timeStr,
						student: item.student,
						rombelName: item.rombel?.nama || (item.student as any)?.rombongan_belajar?.nama,
						status: "success",
						message: "Presensi Apel",
						createdAt: item.created_at,
					};
				});
				setScanLogs(initialLogs);
			}

			if (!lastScannedResult && items[0]) {
				const top = items[0];
				const timeStr = top.created_at
					? new Date(top.created_at).toLocaleTimeString("id-ID", {
							hour: "2-digit",
							minute: "2-digit",
						}) + " WIB"
					: "--:-- WIB";

				setLastScannedResult({
					student: top.student,
					rombelName: top.rombel?.nama || (top.student as any)?.rombongan_belajar?.nama,
					message: "Presensi Apel",
					status: "success",
					timestamp: timeStr,
					createdAt: top.created_at,
				});
			}
		}
	}, [latestAttendanceData]);

	// Check if attendance is Terlambat (Late) based on apel_time_start setting
	const checkIsLate = (timeOrDateString: string) => {
		if (!timeOrDateString) return false;

		let timeStr = timeOrDateString;
		if (timeOrDateString.includes("T") || timeOrDateString.includes("-")) {
			const dateObj = new Date(timeOrDateString);
			timeStr = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
		}

		const cleanTime = timeStr.replace(" WIB", "").replace(".", ":");
		const [h, m] = cleanTime.split(":").map(Number);

		let cutoffStr = (settingData?.value as string) || "07:00";
		if (workdaysData?.value) {
			try {
				const parsed = JSON.parse(String(workdaysData.value));
				if (Array.isArray(parsed) && parsed.length > 0) {
					const daysIndo = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
					const todayKey = daysIndo[new Date().getDay()];
					const found = parsed.find((item: any) => item.key === todayKey);
					if (found && found.openTime) {
						cutoffStr = found.openTime;
					}
				}
			} catch (_) {}
		}
		const cleanCutoff = cutoffStr.replace(".", ":");
		const [cutH, cutM] = cleanCutoff.split(":").map(Number);

		if (isNaN(h) || isNaN(m) || isNaN(cutH) || isNaN(cutM)) return false;

		const scanMinutes = h * 60 + m;
		const cutoffMinutes = cutH * 60 + cutM;

		return scanMinutes > cutoffMinutes;
	};

	// Audio Player for Success and Failed Notifications from /sounds/
	const playSound = (type: "success" | "error") => {
		if (!soundEnabled) return;
		try {
			const soundFile =
				type === "success"
					? "/sounds/success-notification.mp3"
					: "/sounds/failed-notification.mp3";

			const audio = new Audio(soundFile);
			audio.currentTime = 0;
			audio.play().catch(() => {
				playSynthSound(type);
			});
		} catch (e) {
			playSynthSound(type);
		}
	};

	// Fallback Native Web Audio API Sound Synthesizer
	const playSynthSound = (type: "success" | "error") => {
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

		const timeStr =
			new Date().toLocaleTimeString("id-ID", {
				hour: "2-digit",
				minute: "2-digit",
			}) + " WIB";

		try {
			const result = await storeMutation.mutateAsync({ nis: cleanNis });
			playSound("success");
			toast.success(result.message || "Presensi berhasil dicatat!");

			const newLog: ScanLog = {
				id: Math.random().toString(36).substring(2, 9),
				nis: cleanNis,
				timestamp: timeStr,
				student: result.student,
				rombelName: (result.student as any)?.rombongan_belajar?.nama,
				status: "success",
				message: result.message,
				createdAt: new Date().toISOString(),
			};

			setLastScannedResult({
				student: result.student,
				rombelName: (result.student as any)?.rombongan_belajar?.nama,
				message: result.message,
				status: "success",
				timestamp: timeStr,
				createdAt: new Date().toISOString(),
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

	// Custom Green Canvas Tracker with Text Overlay for detected QR/barcode box
	const customGreenTracker = (detectedCodes: any[], ctx: CanvasRenderingContext2D) => {
		detectedCodes.forEach((code) => {
			const { boundingBox, rawValue } = code;
			if (boundingBox) {
				ctx.strokeStyle = "#10b981";
				ctx.lineWidth = 3;
				ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);

				if (rawValue) {
					const text = `${rawValue}`;
					ctx.font = "bold 13px sans-serif";
					const textMetrics = ctx.measureText(text);
					const textWidth = textMetrics.width;
					const badgeHeight = 24;
					const badgeWidth = textWidth + 18;
					const badgeX = boundingBox.x + (boundingBox.width - badgeWidth) / 2;
					const badgeY = Math.max(8, boundingBox.y - badgeHeight - 6);

					ctx.fillStyle = "rgba(16, 185, 129, 0.95)";
					if (typeof ctx.roundRect === "function") {
						ctx.beginPath();
						ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
						ctx.fill();
					} else {
						ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
					}

					ctx.fillStyle = "#ffffff";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(text, badgeX + badgeWidth / 2, badgeY + badgeHeight / 2);
				}
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
			{/* CSS Keyframe for Smooth Continuous Laser Scan Beam */}
			<style>{`
				@keyframes laserSweep {
					0% { top: 3%; opacity: 0.6; }
					50% { top: 94%; opacity: 1; }
					100% { top: 3%; opacity: 0.6; }
				}
				.animate-laser-sweep {
					animation: laserSweep 2.2s ease-in-out infinite;
				}
			`}</style>

			{/* Top Header Bar */}
			<header className="px-6 py-3.5 border-b bg-card shadow-xs flex items-center justify-between sticky top-0 z-50">
				<div className="flex items-center gap-3">
					<Link href="/presensi-siswa" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
						<Image src="/orbit.png" width={32} height={32} alt="Orbit Logo" />
						<div>
							<h1 className="font-bold text-base leading-tight tracking-tight flex items-center gap-1.5">
								Presensi Apel Siswa <BadgeCheck className="w-4 h-4 text-primary" />
							</h1>
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

				{/* Right: Date, Live Clock, Theme Switcher & Actions */}
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
										})}{" "}
										WIB
									</span>
								</>
							) : (
								"--:--:-- WIB"
							)}
						</span>
					</div>

					{/* Theme Switcher Button */}
					<Button
						variant="outline"
						size="sm"
						title="Toggle Theme"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					>
						{isMounted && theme === "dark" ? (
							<Sun className="w-4 h-4 text-amber-400" />
						) : (
							<Moon className="w-4 h-4 text-slate-700" />
						)}
					</Button>

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
				{/* Left / Primary QR Scanner Section */}
				<div className="lg:col-span-7 flex flex-col space-y-4">
					{/* Toolbar: Camera Selection & Toggle */}
					<div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-card border rounded-xl shadow-xs">
						<div className="flex items-center gap-2">
							<QrCode className="w-4 h-4 text-primary" />
							<span className="text-xs font-bold flex items-center gap-1">
								Pemindai QR Code <Sparkles className="w-3 h-3 text-amber-500" />
							</span>
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
						<div className="w-full aspect-square max-h-[480px] bg-black rounded-xl overflow-hidden shadow-inner border-2 border-emerald-500/30 relative flex items-center justify-center mx-auto">
							{isCameraActive ? (
								<>
									<Scanner
										onScan={handleQrScan}
										onError={(err) => console.log("QR Scanner info:", err)}
										scanDelay={2000}
										allowMultiple={false}
										components={{
											finder: false,
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

									{/* Smooth Animated Green Laser Scan Line */}
									<div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#10b981,0_0_8px_#34d399] pointer-events-none z-20 animate-laser-sweep" />

									<div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 z-10 border border-white/10">
										<span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
										<span className="flex items-center gap-1">
											Scanner Active <ShieldCheck className="w-3 h-3 text-emerald-400" />
										</span>
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
					{/* Result Banner Card with DotLottie Player */}
					<Card className="shadow-md relative overflow-hidden">
						<CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
							<CardTitle className="text-base flex items-center gap-1.5">
								<Flame className="w-4 h-4 text-amber-500" /> Hasil Scan Terakhir
							</CardTitle>
							{lastScannedResult && (
								<span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
									<Clock className="w-3 h-3" /> {lastScannedResult.timestamp}
								</span>
							)}
						</CardHeader>
						<CardContent className="pt-4">
							{lastScannedResult ? (
								<div
									className={`p-4 rounded-xl border shadow-xs relative ${
										lastScannedResult.status === "success"
											? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
											: "bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-800"
									}`}
								>
									<div className="flex items-start gap-4">
										<Avatar className="w-14 h-14 border-2 border-emerald-500/50 shadow-xs shrink-0">
											<AvatarImage
												src={(lastScannedResult.student as any)?.avatar}
												alt={lastScannedResult.student?.fullname}
											/>
											<AvatarFallback className="bg-emerald-600 text-white font-bold text-lg">
												{lastScannedResult.student?.fullname?.substring(0, 2).toUpperCase() || "SW"}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-1.5 min-w-0">
													<h3 className="font-bold text-base truncate leading-tight">
														{lastScannedResult.student?.fullname || "Presensi Apel"}
													</h3>

													{/* DotLottie checkmark/error animation right beside student name */}
													{isMounted && (
														<div className="inline-flex items-center justify-center shrink-0">
															{lastScannedResult.status === "success" ? (
																<DotLottieReact
																	src="/lotties/success-confetti.lottie"
																	autoplay
																	loop
																	style={{ height: "40px", width: "40px" }}
																/>
															) : (
																<DotLottieReact
																	src="/lotties/error.lottie"
																	autoplay
																	loop
																	style={{ height: "32px", width: "32px" }}
																/>
															)}
														</div>
													)}
												</div>

												{/* Status badge: Terlambat vs Hadir vs Gagal */}
												{lastScannedResult.status === "success" ? (
													checkIsLate(lastScannedResult.timestamp || lastScannedResult.createdAt || "") ? (
														<Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] shrink-0">
															Terlambat
														</Badge>
													) : (
														<Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shrink-0">
															Hadir
														</Badge>
													)
												) : (
													<Badge variant="destructive" className="text-[11px] shrink-0">
														Gagal
													</Badge>
												)}
											</div>

											<div className="mt-2.5 space-y-1 text-xs text-muted-foreground border-t pt-2">
												<p className="flex items-center gap-1.5">
													<User className="w-3.5 h-3.5 text-muted-foreground" />
													<span className="font-medium text-foreground">NIS / NIPD:</span>{" "}
													<span className="font-mono">
														{lastScannedResult.student?.nipd ||
															(lastScannedResult.student as any)?.nisn ||
															(lastScannedResult as any).nis ||
															"-"}
													</span>
												</p>
												<p className="flex items-center gap-1.5">
													<GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
													<span className="font-medium text-foreground">Kelas:</span>{" "}
													<span>
														{lastScannedResult.rombelName ||
															(lastScannedResult.student as any)?.rombongan_belajar?.nama ||
															"-"}
													</span>
												</p>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="py-8 text-center text-muted-foreground text-xs flex flex-col items-center justify-center">
									<DotLottieReact
										src="/lotties/empty.lottie"
										autoplay
										loop
										style={{ height: "90px", width: "90px" }}
									/>
									<p className="mt-2 text-xs">Belum ada data presensi apel hari ini</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Live Session Log List (Clean Divided List with Separator, Top 10 items) */}
					<Card className="shadow-xs flex-1">
						<CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
							<div>
								<CardTitle className="text-base flex items-center gap-1.5">
									<Activity className="w-4 h-4 text-primary" /> Aktivitas Sesi Presensi
								</CardTitle>
								<CardDescription className="text-xs">
									Total Terdaftar Hari Ini: {latestAttendanceData?.attendances?.total ?? 0} Siswa
								</CardDescription>
							</div>
							<Badge variant="outline" className="text-xs">
								{scanLogs.slice(0, 10).length} Terakhir
							</Badge>
						</CardHeader>
						<CardContent className="pt-2">
							{scanLogs.length === 0 ? (
								<div className="py-8 text-center text-muted-foreground text-xs flex flex-col items-center justify-center">
									<DotLottieReact
										src="/lotties/empty.lottie"
										autoplay
										loop
										style={{ height: "80px", width: "80px" }}
									/>
									<p className="mt-2">Belum ada aktivitas scan.</p>
								</div>
							) : (
								<div className="divide-y divide-border max-h-[340px] overflow-y-auto pr-1">
									{scanLogs.slice(0, 10).map((log, index) => {
										const isLate = checkIsLate(log.timestamp || log.createdAt || "");
										const nipdText = log.student?.nipd || (log.student as any)?.nisn || log.nis || "-";
										const kelasText =
											log.rombelName || (log.student as any)?.rombongan_belajar?.nama || "-";

										return (
											<div key={log.id} className="py-3 first:pt-1 last:pb-1">
												<div className="flex items-center justify-between gap-3">
													<div className="flex items-center gap-3 min-w-0">
														<Avatar className="w-9 h-9 border shrink-0">
															<AvatarImage
																src={(log.student as any)?.avatar}
																alt={log.student?.fullname}
															/>
															<AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
																{log.student?.fullname?.substring(0, 2).toUpperCase() || "SW"}
															</AvatarFallback>
														</Avatar>
														<div className="min-w-0">
															<p className="font-bold truncate text-xs flex items-center gap-1">
																{log.student?.fullname || `NIS: ${log.nis}`}
															</p>
															<p className="text-muted-foreground text-[11px] truncate mt-0.5">
																NIS: <span className="font-mono font-medium">{nipdText}</span> • Kelas:{" "}
																<span className="font-medium">{kelasText}</span>
															</p>
														</div>
													</div>

													<div className="text-right shrink-0">
														{log.status === "success" ? (
															isLate ? (
																<Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold px-2 py-0.5">
																	Terlambat
																</Badge>
															) : (
																<Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5">
																	Hadir
																</Badge>
															)
														) : (
															<Badge variant="destructive" className="text-[10px] px-2 py-0.5">
																Gagal
															</Badge>
														)}
														<p className="text-muted-foreground text-[10px] mt-1 font-mono">
															{log.timestamp}
														</p>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
