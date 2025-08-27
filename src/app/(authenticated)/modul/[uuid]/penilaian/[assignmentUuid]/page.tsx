"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
	Calendar,
	Clock,
	Download,
	Edit,
	Loader2,
	NotebookPen,
	RefreshCw,
	Target,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { DatePicker } from "@/app/(authenticated)/components/date-picker";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import {
	useAssignmentShowQuery,
	usePatchAssignmentGradeMutation,
	usePatchAssignmentNotesMutation,
	useUpdateAssignmentMutation,
} from "@/queries/useAssignmentQuery";
import type { AssignmentSheet } from "@/store/useAssignment";

export default function AssignmentPage() {
	const { assignmentUuid, uuid: modulUuid } = useParams<{
		assignmentUuid: string;
		uuid: string;
	}>();
	const [isRefreshing, setRefreshing] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

	// Form state for edit dialog
	const [editForm, setEditForm] = useState({
		title: "",
		body: "",
		kkm_value: "",
		date: "",
		due_date: "",
	});

	const showQuery = useAssignmentShowQuery(assignmentUuid);
	const patchGrade = usePatchAssignmentGradeMutation(assignmentUuid);
	const patchNotes = usePatchAssignmentNotesMutation(assignmentUuid);
	const updateAssignment = useUpdateAssignmentMutation();

	const sheets: AssignmentSheet[] = useMemo(() => {
		const list = showQuery.data?.sheets;
		return Array.isArray(list) ? list : [];
	}, [showQuery.data]);

	const kkm = useMemo<number | null>(() => {
		const raw = showQuery.data?.kkm_value as number | string | null | undefined;
		if (raw == null) return null;
		return typeof raw === "number" ? raw : Number(raw);
	}, [showQuery.data?.kkm_value]);

	const summary = useMemo(() => {
		let tuntas = 0;
		let tidakTuntas = 0;
		let belumDinilai = 0;
		sheets.forEach((s) => {
			const g = s.grade;
			if (g === null || g === undefined || g === "") {
				belumDinilai++;
				return;
			}
			const num = Number(g);
			if (Number.isNaN(num)) {
				belumDinilai++;
				return;
			}
			if (kkm != null) {
				if (num >= kkm) tuntas++;
				else tidakTuntas++;
			} else {
				// Without KKM, treat graded as tuntas-neutral
				tuntas++;
			}
		});
		return { tuntas, tidakTuntas, belumDinilai };
	}, [sheets, kkm]);

	const columns = useMemo<ColumnDef<AssignmentSheet>[]>(
		() => [
			{ header: "No", cell: (ctx) => ctx.row.index + 1, maxSize: 60 },
			{
				header: "Siswa",
				accessorKey: "student_name",
				cell: (ctx) => {
					const name = (ctx.getValue() as string) || "-";
					const nis = (ctx.row.original as any).student_nis as
						| string
						| undefined;
					return (
						<div className="flex flex-col">
							<span className="font-medium">{name}</span>
							{nis && (
								<span className="text-muted-foreground text-xs">{nis}</span>
							)}
						</div>
					);
				},
			},
			{
				header: "Nilai",
				accessorKey: "grade",
				cell: (ctx) => (
					<GradeAction
						studentId={String(ctx.row.original.student_id || "")}
						initial={ctx.getValue() as number | string | null}
						kkmValue={showQuery.data?.kkm_value as number | null | undefined}
						onUpdated={() => showQuery.refetch()}
						mutate={(payload) => patchGrade.mutateAsync(payload)}
					/>
				),
			},
			{
				header: "Catatan",
				accessorKey: "notes",
				cell: (ctx) => (
					<NotesAction
						studentId={String(ctx.row.original.student_id || "")}
						initial={(ctx.getValue() as string | null) ?? ""}
						onUpdated={() => showQuery.refetch()}
						mutate={(payload) => patchNotes.mutateAsync(payload)}
					/>
				),
			},
		],
		[patchGrade, patchNotes, showQuery],
	);

	const table = useReactTable({
		data: sheets,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	const handleRefresh = async () => {
		setRefreshing(true);
		await showQuery.refetch();
		setRefreshing(false);
	};

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const res = await api.get(
				`/modul/assignment/export/single/${assignmentUuid}`,
				{ responseType: "blob" },
			);
			const contentType =
				(res.headers as any)["content-type"] || "application/octet-stream";
			const blob = new Blob([res.data], { type: contentType });
			let filename = `penilaian-${assignmentUuid}`;
			const disposition = (res.headers as any)["content-disposition"] as
				| string
				| undefined;
			if (disposition) {
				const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(
					disposition,
				);
				const name = decodeURIComponent(match?.[1] || match?.[2] || "");
				if (name) filename = name;
			}
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
			URL.revokeObjectURL(url);
		} catch {
			toast({
				title: "Gagal",
				description: "Tidak dapat mengunduh laporan",
				variant: "destructive",
			});
		} finally {
			setIsExporting(false);
		}
	};

	const formatDate = (d?: string | null) => {
		if (!d) return "-";
		try {
			return format(new Date(d), "EEEE, dd MMM yyyy", { locale: localeId });
		} catch {
			return "-";
		}
	};

	const handleEditDialogOpen = () => {
		// Populate form with current data
		setEditForm({
			title: showQuery.data?.title || "",
			body: showQuery.data?.body || "",
			kkm_value: showQuery.data?.kkm_value?.toString() || "",
			date: showQuery.data?.date ? String(showQuery.data.date) : "",
			due_date: showQuery.data?.due_date ? String(showQuery.data.due_date) : "",
		});
		setIsEditDialogOpen(true);
	};

	const handleSave = async () => {
		try {
			await updateAssignment.mutateAsync({
				assignmentUuid,
				body: {
					orbit_modul_uuid: modulUuid,
					teacher_id: (showQuery.data as any)?.teacher?.teacher_id || "",
					title: editForm.title,
					body: editForm.body || null,
					kkm_value: editForm.kkm_value ? Number(editForm.kkm_value) : null,
					date: editForm.date || null,
					due_date: editForm.due_date || null,
				},
			});

			setIsEditDialogOpen(false);
		} catch (error) {
			// Error handling is done by the mutation
			console.error("Failed to update assignment:", error);
		}
	};

	return (
		<div>
			<div className="flex flex-row justify-between items-center mb-5">
				<div>
					<div className="flex items-center gap-2">
						<NotebookPen className="w-5 h-5" />
						{showQuery.data?.title ?? "Detail Penilaian"}
					</div>
					<div className="text-muted-foreground text-sm">
						{showQuery.data?.body ?? "Detail tugas/penilaian"}
					</div>
					<div className="flex flex-wrap gap-4 mt-2 text-sm">
						<div className="flex items-center gap-2">
							<Calendar className="w-4 h-4" />
							<span>
								Pada: {formatDate(showQuery.data?.date as string | null)}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>
								Sampai: {formatDate(showQuery.data?.due_date as string | null)}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Target className="w-4 h-4" />
							<span>KKM: {String(showQuery.data?.kkm_value ?? "-")}</span>
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleEditDialogOpen}
						className="flex items-center gap-2"
					>
						<Edit className="w-4 h-4" />
						Edit
					</Button>
					<Button
						variant="outline"
						onClick={handleExport}
						disabled={isExporting}
						className="flex items-center gap-2"
					>
						{isExporting ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Download className="w-4 h-4" />
						)}
						Export
					</Button>
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={isRefreshing || showQuery.isFetching}
						className="flex items-center gap-2"
					>
						{showQuery.isFetching ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<RefreshCw className="w-4 h-4" />
						)}
						Refresh
					</Button>
				</div>
			</div>
			{/* add table information on count tuntas, tidak tuntas and belum dinilai */}
			<ScrollArea>
				<div className="font-medium">Rekap Penilaian</div>
				<div className="flex flex-wrap gap-3">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="whitespace-nowrap">Tuntas</TableHead>
								<TableHead className="whitespace-nowrap">
									Tidak Tuntas
								</TableHead>
								<TableHead className="whitespace-nowrap">
									Belum Dinilai
								</TableHead>
								<TableHead className="whitespace-nowrap">Total</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>
									<p className="font-medium text-green-600 dark:text-green-500">
										{summary.tuntas}
									</p>
								</TableCell>
								<TableCell>
									<p className="font-medium text-red-600 dark:text-red-500">
										{summary.tidakTuntas}
									</p>
								</TableCell>
								<TableCell>
									<p className="font-medium text-amber-600 dark:text-amber-500">
										{summary.belumDinilai}
									</p>
								</TableCell>
								<TableCell>
									<p className="font-medium text-slate-600 dark:text-slate-400">
										{summary.tuntas +
											summary.tidakTuntas +
											summary.belumDinilai}
									</p>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
			<div className="relative mt-2 border rounded-md w-full">
				<ScrollArea>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id} className="p-2">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="p-2">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>
			</div>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="sm:max-w-[600px]">
					<DialogHeader>
						<DialogTitle>Edit Penilaian</DialogTitle>
					</DialogHeader>
					<div className="gap-4 grid py-4">
						<div className="items-center gap-4 grid grid-cols-4">
							<label htmlFor="title" className="text-right">
								Judul
							</label>
							<Input
								id="title"
								value={editForm.title}
								onChange={(e) =>
									setEditForm((prev) => ({ ...prev, title: e.target.value }))
								}
								className="col-span-3"
							/>
						</div>
						<div className="items-center gap-4 grid grid-cols-4">
							<label htmlFor="body" className="text-right">
								Deskripsi
							</label>
							<Input
								id="body"
								value={editForm.body}
								onChange={(e) =>
									setEditForm((prev) => ({ ...prev, body: e.target.value }))
								}
								className="col-span-3"
							/>
						</div>
						<div className="items-center gap-4 grid grid-cols-4">
							<label htmlFor="date" className="text-right">
								Tanggal Mulai
							</label>
							<div className="col-span-3">
								<DatePicker
									selectedDate={editForm.date || undefined}
									onSelect={(date) => {
										const formattedDate = date.toISOString().split("T")[0];
										setEditForm((prev) => ({ ...prev, date: formattedDate }));
									}}
								/>
							</div>
						</div>
						<div className="items-center gap-4 grid grid-cols-4">
							<label htmlFor="due_date" className="text-right">
								Tanggal Selesai
							</label>
							<div className="col-span-3">
								<DatePicker
									selectedDate={editForm.due_date || undefined}
									onSelect={(date) => {
										const formattedDate = date.toISOString().split("T")[0];
										setEditForm((prev) => ({
											...prev,
											due_date: formattedDate,
										}));
									}}
								/>
							</div>
						</div>
						<div className="items-center gap-4 grid grid-cols-4">
							<label htmlFor="kkm" className="text-right">
								KKM
							</label>
							<Input
								id="kkm"
								type="number"
								value={editForm.kkm_value}
								onChange={(e) =>
									setEditForm((prev) => ({
										...prev,
										kkm_value: e.target.value,
									}))
								}
								className="col-span-3"
							/>
						</div>
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setIsEditDialogOpen(false)}
							disabled={updateAssignment.isPending}
						>
							Batal
						</Button>
						<Button onClick={handleSave} disabled={updateAssignment.isPending}>
							{updateAssignment.isPending ? (
								<>
									<Loader2 className="mr-2 w-4 h-4 animate-spin" />
									Menyimpan...
								</>
							) : (
								"Simpan"
							)}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function GradeAction({
	studentId,
	initial,
	kkmValue,
	onUpdated,
	mutate,
}: {
	studentId: string;
	initial: number | string | null;
	kkmValue?: number | null;
	onUpdated?: () => void;
	mutate: (payload: {
		student_id: string;
		grade: number | null;
	}) => Promise<unknown>;
}) {
	const [grade, setGrade] = useState<string>(
		initial === null || initial === undefined ? "" : String(initial),
	);
	const [loading, setLoading] = useState(false);
	const debounceRef = useRef<NodeJS.Timeout>();

	const numericGrade = grade === "" ? null : Number(grade);
	const kkmNum =
		typeof kkmValue === "number"
			? kkmValue
			: kkmValue == null
				? null
				: Number(kkmValue);
	const colorClass =
		kkmNum != null && numericGrade != null
			? numericGrade >= kkmNum
				? "text-green-600 dark:text-green-500"
				: "text-red-600 dark:text-red-500"
			: "";

	return (
		<Input
			value={grade}
			type="number"
			placeholder="Nilai"
			disabled={loading}
			min={0}
			max={100}
			className={`${colorClass} w-24`}
			onChange={(e) => {
				const nextVal = e.currentTarget.value;
				setGrade(nextVal);
				if (debounceRef.current) clearTimeout(debounceRef.current);
				debounceRef.current = setTimeout(async () => {
					const num = nextVal === "" ? null : Number(nextVal);
					if (nextVal !== "" && Number.isNaN(num)) return;
					setLoading(true);
					try {
						await mutate({ student_id: String(studentId), grade: num });
						toast({
							title: "Berhasil",
							description: "Nilai berhasil disimpan",
						});
						onUpdated?.();
					} catch {
						toast({
							title: "Gagal",
							description: "Tidak dapat menyimpan nilai",
							variant: "destructive",
						});
					} finally {
						setLoading(false);
					}
				}, 2000);
			}}
		/>
	);
}

function NotesAction({
	studentId,
	initial,
	onUpdated,
	mutate,
}: {
	studentId: string;
	initial: string;
	onUpdated?: () => void;
	mutate: (payload: {
		student_id: string;
		notes: string | null;
	}) => Promise<unknown>;
}) {
	const [notes, setNotes] = useState<string>(initial ?? "");
	const [loading, setLoading] = useState(false);
	const debounceRef = useRef<NodeJS.Timeout>();

	return (
		<Input
			value={notes}
			placeholder="Catatan (opsional)"
			disabled={loading}
			className="min-w-[150px]"
			onChange={(e) => {
				const nextVal = e.currentTarget.value;
				setNotes(nextVal);
				if (debounceRef.current) clearTimeout(debounceRef.current);
				debounceRef.current = setTimeout(async () => {
					setLoading(true);
					try {
						await mutate({
							student_id: String(studentId),
							notes: nextVal === "" ? null : nextVal,
						});
						toast({
							title: "Berhasil",
							description: "Catatan berhasil disimpan",
						});
						onUpdated?.();
					} catch {
						toast({
							title: "Gagal",
							description: "Tidak dapat menyimpan catatan",
							variant: "destructive",
						});
					} finally {
						setLoading(false);
					}
				}, 2000);
			}}
		/>
	);
}
