"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { useCreateModulMutation } from "@/queries/useModulQuery";
import { IconPlus } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { useCallback, useState } from "react";
import SelectMapel from "../../components/form/select-mapel";
import SelectRombel from "../../components/form/select-rombel";

export default function DialogModul() {
	// loading state
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState({
		rombongan_belajar_id: null,
		mapel_id: null,
	});

	const createMutation = useCreateModulMutation();

	const handleSave = useCallback(async () => {
		setIsLoading(true);
		try {
			await createMutation.mutateAsync(selected);
			toast({
				title: "Berhasil",
				description: "Modul berhasil dibuat",
			});
			setOpen(false);
			setSelected({
				rombongan_belajar_id: null,
				mapel_id: null,
			});
		} catch {
			toast({
				title: "Error",
				description: "Gagal membuat modul",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [selected, createMutation]);

	// no-op helper reserved for future enhancements

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="flex items-center">
					<IconPlus className="mr-2 w-5 h-5" />
					Buat Modul Baru
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Buat Modul Baru</DialogTitle>
				</DialogHeader>

				{/* form to use to create new modul */}
				<div className="gap-4 grid py-4">
					<div className="gap-2 grid">
						<label htmlFor="name">Pilih Rombel</label>
						<SelectRombel
							onSelected={(e) =>
								setSelected((s) => ({ ...s, rombongan_belajar_id: e }))
							}
						/>
					</div>
					<div className="gap-2 grid">
						<label htmlFor="name">Pilih Mapel</label>
						<SelectMapel
							onSelected={(e) => setSelected((s) => ({ ...s, mapel_id: e }))}
						/>
					</div>
				</div>
				{/* button submit */}
				<DialogFooter>
					<Button disabled={isLoading} onClick={handleSave}>
						{isLoading && <Loader className="mr-2" size={16} />}
						Simpan
					</Button>
					<Button variant={`ghost`} onClick={() => setOpen(false)}>
						Batal
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
