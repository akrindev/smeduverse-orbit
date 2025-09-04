"use client";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { usePresence } from "@/store/usePresence";
import type { Attendance } from "@/types/attendance";
import { type BaseSyntheticEvent, useEffect, useRef, useState } from "react";

// Status config map
const STATUS_OPTIONS = {
	h: { text: "Hadir", color: "text-green-600 dark:text-green-500 font-medium" },
	i: { text: "Izin", color: "text-amber-600 dark:text-amber-500 font-medium" },
	s: { text: "Sakit", color: "text-blue-600 dark:text-blue-500 font-medium" },
	a: { text: "Alpa", color: "text-red-600 dark:text-red-500 font-medium" },
	b: { text: "Bolos", color: "text-rose-600 dark:text-rose-500 font-medium" },
} as const;

type StatusType = keyof typeof STATUS_OPTIONS;

export default function TablePresensi({
	attendances,
	onUpdateAction,
}: {
	attendances: Attendance[];
	onUpdateAction?: () => void;
}) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="hidden md:flex"></TableHead>
					<TableHead>Nama</TableHead>
					<TableHead>Status</TableHead>
					<TableHead>Note</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{attendances.map((attendance, i) => (
					<TableRow key={attendance.student_id}>
						<TableCell className="hidden md:flex justify-center items-center p-2 w-[40px]">
							{i + 1}
						</TableCell>
						<TableCell className="p-2 max-w-[500px] font-normal md:font-medium truncate">
							<span className="font-normal text-gray-300 dark:text-gray-700">
								{attendance.nipd}
							</span>
							<br />
							{attendance.fullname}
						</TableCell>
						<TableCell className="p-2">
							<StatusAction
								attendance={attendance}
								onUpdateAction={onUpdateAction}
							/>
						</TableCell>
						<TableCell className="p-2">
							<NoteAction
								attendance={attendance}
								onUpdateAction={onUpdateAction}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

function StatusAction({
	attendance,
	onUpdateAction,
}: {
	attendance: Attendance;
	onUpdateAction?: () => void;
}) {
	const [status, setStatus] = useState<StatusType>(
		(attendance.presence?.status as StatusType) ?? "a",
	);
	const [loading, setLoading] = useState(false);
	const updateAttendance = usePresence((state) => state.updateAttendance);

	async function handleChange(newStatus: StatusType) {
		setStatus(newStatus);
		setLoading(true);
		try {
			const res = await updateAttendance({ attendance, status: newStatus });
			if (res.status === 200) {
				toast({
					title: "Berhasil",
					description: "Status kehadiran berhasil diubah",
				});
				onUpdateAction?.();
			}
		} catch {
			toast({
				title: "Gagal",
				description: "Tidak dapat mengubah status kehadiran",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<Select value={status} onValueChange={handleChange} disabled={loading}>
			<SelectTrigger className={`w-[150px] ${STATUS_OPTIONS[status]?.color}`}>
				<SelectValue placeholder="Status Kehadiran" />
			</SelectTrigger>
			<SelectContent>
				{Object.entries(STATUS_OPTIONS).map(([value, { text, color }]) => (
					<SelectItem
						key={value}
						value={value}
						className={`font-medium ${color}`}
					>
						{text}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

function NoteAction({
	attendance,
	onUpdateAction,
}: {
	attendance: Attendance;
	onUpdateAction?: () => void;
}) {
	const [notes, setNotes] = useState(attendance.presence?.notes ?? "");
	const [loading, setLoading] = useState(false);
	const updateAttendanceNotes = usePresence(
		(state) => state.updateAttendanceNotes,
	);
	const debounceRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(async () => {
			if (notes !== (attendance.presence?.notes ?? "")) {
				setLoading(true);
				try {
					const res = await updateAttendanceNotes({ attendance, notes });
					if (res.status === 200) {
						toast({
							title: "Berhasil",
							description: "Catatan kehadiran berhasil diubah",
						});
						onUpdateAction?.();
					}
				} catch {
					toast({
						title: "Gagal",
						description: "Tidak dapat mengubah catatan kehadiran",
						variant: "destructive",
					});
				} finally {
					setLoading(false);
				}
			}
		}, 2000);
		return () => clearTimeout(debounceRef.current);
	}, [notes, attendance, updateAttendanceNotes, onUpdateAction]);

	return (
		<Input
			value={notes}
			onChange={(e: BaseSyntheticEvent) => setNotes(e.target.value)}
			placeholder="Catatan Kehadiran"
			disabled={loading}
			className="min-w-[150px]"
		/>
	);
}
