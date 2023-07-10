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
import { IconPlus } from "@tabler/icons-react";
import SelectTeacher from "../../components/form/select-teacher";
import SelectRombel from "../../components/form/select-rombel";
import SelectMapel from "../../components/form/select-mapel";
import { useEffect, useState } from "react";
import { useModul } from "@/store/useModul";
import { toast } from "@/components/ui/use-toast";
import { Loader, Trash } from "lucide-react";

export default function DialogConfirmDeleteModul({ uuid }: { uuid: string }) {
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const destroyModul = useModul((state) => state.destroy);

  const handleDelete = async () => {
    setIsLoading(true);
    const response = await destroyModul(uuid);

    if (response.status === 200) {
      //   toast
      toast({
        title: "Berhasil",
        description: "Modul berhasil dihapus",
      });
      //   close dialog
      setOpen(false);
      // reset selected
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="p-2 flex items-center"
          variant={"ghost"}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash className="w-4 h-4 mr-2 text-rose-600" />
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
