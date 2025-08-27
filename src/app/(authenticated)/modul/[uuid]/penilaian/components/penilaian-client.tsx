"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	BookOpen,
	Download,
	Loader2,
	PlusCircle,
	RefreshCw,
	Save,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { DatePicker } from "@/app/(authenticated)/components/date-picker";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import {
	useAssignmentsQuery,
	useCreateAssignmentMutation,
	useDeleteAssignmentMutation,
} from "@/queries/useAssignmentQuery";
import type { Assignment } from "@/store/useAssignment";
import { useAuth } from "@/store/useAuth";

export default function PenilaianClient({ modulUuid }: { modulUuid: string }) {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const { user } = useAuth();
	const teacherId = user?.teacher?.teacher_id || "";
	const [form, setForm] = useState({
		title: "",
		body: "",
		kkm_value: undefined as number | undefined,
		date: "",
		due_date: "",
		// required backend fields
		orbit_modul_uuid: modulUuid,
		teacher_id: teacherId,
	});

	const listQuery = useAssignmentsQuery(modulUuid);
	const createMutation = useCreateAssignmentMutation();
	const deleteMutation = useDeleteAssignmentMutation();

	const assignments: Assignment[] = useMemo(
		() => listQuery.data?.list ?? [],
		[listQuery.data?.list],
	);

	const handleSave = async () => {
		if (!form.title?.trim()) return;
		if (!teacherId) return;
		setLoading(true);
		try {
			await createMutation.mutateAsync({
				orbit_modul_uuid: modulUuid,
				teacher_id: teacherId,
				title: form.title,
				body: form.body || undefined,
				kkm_value:
					form.kkm_value === undefined || Number.isNaN(form.kkm_value)
						? undefined
						: Number(form.kkm_value),
				date: form.date || undefined,
				due_date: form.due_date || undefined,
			});
			setOpen(false);
			setForm({
				title: "",
				body: "",
				kkm_value: undefined,
				date: "",
				due_date: "",
				orbit_modul_uuid: modulUuid,
				teacher_id: teacherId,
			});
			await listQuery.refetch();
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (uuid: string) => {
		setLoading(true);
		try {
			await deleteMutation.mutateAsync(uuid);
			await listQuery.refetch();
		} finally {
			setLoading(false);
		}
	};

	const handleExport = async () => {
		setIsExporting(true);
		try {
			const res = await api.get(`/modul/assignment/export/${modulUuid}`, {
				responseType: "blob",
			});
			const contentType =
				(res.headers["content-type"] as string) || "application/octet-stream";
			const blob = new Blob([res.data], { type: contentType });
			let filename = `penilaian-${modulUuid}`;
			const disposition = res.headers["content-disposition"] as
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

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between items-center">
				<div>
					<CardTitle>Daftar Penilaian</CardTitle>
					<CardDescription>Tugas/penilaian pada modul ini</CardDescription>
				</div>
				<div className="flex items-center gap-2">
					<Link href={`/modul/assignment/recap/${modulUuid}`}>
						<Button variant={`outline`}>
							<BookOpen className="w-4 h-4" />
							Rekap Tugas
						</Button>
					</Link>
					<Button
						onClick={handleExport}
						disabled={isExporting}
						variant={`outline`}
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
						onClick={() => listQuery.refetch()}
						disabled={listQuery.isFetching}
						className="flex items-center gap-2"
					>
						<RefreshCw className="w-4 h-4" /> Refresh
					</Button>
					<Button
						onClick={() => setOpen(true)}
						className="flex items-center gap-2"
					>
						<PlusCircle className="w-4 h-4" /> Buat Penilaian
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{listQuery.isLoading ? (
					<div className="flex justify-center items-center py-10">
						<Loader2 className="w-6 h-6 animate-spin" />
					</div>
				) : !Array.isArray(assignments) || assignments.length === 0 ? (
					<div className="py-8 text-center">Belum ada penilaian</div>
				) : (
					<AssignmentReactTable data={assignments} onDelete={handleDelete} />
				)}
			</CardContent>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Buat Penilaian</DialogTitle>
					</DialogHeader>
					<div className="space-y-3">
						<div className="space-y-2">
							<label htmlFor="title" className="font-medium text-sm">
								Judul Penilaian *
							</label>
							<Input
								id="title"
								placeholder="Masukkan judul penilaian"
								value={form.title}
								onChange={(e) =>
									setForm((p) => ({ ...p, title: e.target.value }))
								}
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="body" className="font-medium text-sm">
								Keterangan (Opsional)
							</label>
							<Textarea
								id="body"
								placeholder="Masukkan keterangan atau deskripsi penilaian"
								value={form.body}
								onChange={(e) =>
									setForm((p) => ({ ...p, body: e.target.value }))
								}
							/>
						</div>
						<div className="gap-3 grid grid-cols-1 md:grid-cols-3">
							<div className="space-y-2">
								<label htmlFor="kkm" className="font-medium text-sm">
									KKM (Opsional)
								</label>
								<Input
									id="kkm"
									type="number"
									placeholder="Masukkan nilai KKM"
									value={form.kkm_value ?? ""}
									onChange={(e) =>
										setForm((p) => ({
											...p,
											kkm_value:
												e.target.value === ""
													? undefined
													: Number(e.target.value),
										}))
									}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="date" className="font-medium text-sm">
									Tanggal (Opsional)
								</label>
								<DatePicker
									selectedDate={form.date || undefined}
									onSelect={(date) => {
										const formattedDate = date.toISOString().split("T")[0];
										setForm((p) => ({ ...p, date: formattedDate }));
									}}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="due_date" className="font-medium text-sm">
									Batas Waktu (Opsional)
								</label>
								<DatePicker
									selectedDate={form.due_date || undefined}
									onSelect={(date) => {
										const formattedDate = date.toISOString().split("T")[0];
										setForm((p) => ({ ...p, due_date: formattedDate }));
									}}
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={handleSave}
							disabled={loading}
							className="flex items-center gap-2"
						>
							{loading ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
							Simpan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	);
}

type AssignmentReactTableProps = {
	data: Assignment[];
	onDelete: (uuid: string) => void;
};

function AssignmentReactTable({ data }: AssignmentReactTableProps) {
	const { uuid: modulUuid } = useParams<{ uuid: string }>();
	const router = useRouter();
	const columns = useMemo<ColumnDef<Assignment>[]>(
		() => [
			{
				header: "No",
				cell: (ctx) => ctx.row.index + 1,
				maxSize: 60,
			},
			{
				header: "Judul",
				accessorKey: "title",
				cell: (ctx) => (
					<div className="max-w-[260px] font-medium truncate">
						{(ctx.getValue() as string) ?? "-"}
					</div>
				),
			},
			{
				header: "Deskripsi",
				accessorKey: "body",
				cell: (ctx) => (
					<div className="max-w-[420px] truncate">
						{(ctx.getValue() as string) || "-"}
					</div>
				),
			},
			{
				header: "Tanggal",
				accessorKey: "date",
				cell: (ctx) => {
					const dateValue = ctx.getValue() as string;
					if (!dateValue)
						return <div className="max-w-[120px] truncate">-</div>;

					const date = new Date(dateValue);
					const formattedDate = date.toLocaleDateString("id-ID", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					});

					return <div className="max-w-[120px] truncate">{formattedDate}</div>;
				},
			},
			{
				header: "KKM",
				accessorKey: "kkm_value",
				cell: (ctx) => (
					<div className="max-w-[60px] truncate">
						{ctx.getValue() as string}
					</div>
				),
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="border rounded-md">
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
						<TableRow
							key={row.id}
							onClick={() =>
								router.push(
									`/modul/${modulUuid}/penilaian/${row.original.uuid}`,
								)
							}
							className="cursor-pointer"
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id} className="p-2">
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
