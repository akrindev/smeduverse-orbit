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
import { Loader } from "lucide-react";

export default function DialogModul() {
  // loading state
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({
    rombongan_belajar_id: null,
    teacher_id: null,
    mapel_id: null,
  });

  const storeModul = useModul((state) => state.store);

  const handleSave = async () => {
    setIsLoading(true);
    const response = await storeModul(selected);

    if (response.status === 201) {
      //   toast
      toast({
        title: "Berhasil",
        description: "Modul berhasil dibuat",
      });
      //   close dialog
      setOpen(false);
      // reset selected
      setSelected({
        rombongan_belajar_id: null,
        teacher_id: null,
        mapel_id: null,
      });
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          <IconPlus className="w-5 h-5 mr-2" />
          Buat Modul Baru
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Modul Baru</DialogTitle>
        </DialogHeader>

        {/* form to use to create new modul */}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name">Pilih Rombel</label>
            <SelectRombel
              onSelected={(e) =>
                setSelected((s) => ({ ...s, rombongan_belajar_id: e }))
              }
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="name">Pilih Guru</label>
            <SelectTeacher
              onSelected={(e) => setSelected((s) => ({ ...s, teacher_id: e }))}
            />
          </div>
          <div className="grid gap-2">
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
