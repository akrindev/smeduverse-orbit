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
import { useDeleteModulMutation } from "@/queries/useModulQuery";
import { Loader, Trash } from "lucide-react";
import { useState } from "react";

export default function DialogConfirmDeleteModul({ uuid }: { uuid: string }) {
	// loading state
	const [isLoading, setIsLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const deleteMutation = useDeleteModulMutation();

	const handleDelete = async () => {
		setIsLoading(true);
		await deleteMutation.mutateAsync(uuid);
		toast({
			title: "Berhasil",
			description: "Modul berhasil dihapus",
		});
		setOpen(false);

		setIsLoading(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className="flex items-center p-2"
					variant={"ghost"}
					onClick={(e) => e.stopPropagation()}
				>
					<Trash className="mr-2 w-4 h-4 text-rose-600" />
					Hapus
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hapus Modul</DialogTitle>
				</DialogHeader>

				{/* form to use to create new modul */}
				<p>Apakah kamu yakin akan menghapus modul ini?</p>
				{/* button submit */}
				<DialogFooter>
					<Button disabled={isLoading} onClick={handleDelete}>
						{isLoading && <Loader className="mr-2" size={16} />}
						Hapus
					</Button>
					<Button variant={`ghost`} onClick={() => setOpen(false)}>
						Batal
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
