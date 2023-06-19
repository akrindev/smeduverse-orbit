"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useMapel } from "@/store/useMapel";
import { Mapel } from "@/types/modul";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function DialogMataPelajaran({ mapel }: { mapel?: Mapel }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [kode, setKode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [store, update] = useMapel((state) => [state.store, state.update]);

  const handleMapel = async () => {
    setIsLoading(true);

    const body = {
      nama: name,
      kode: kode,
    };
    // if mapel is not null, update mapel
    const response = await (mapel
      ? update(mapel.id, body)
      : store(body)
    ).finally(() => {
      setIsLoading(false);
    });

    if (response.status === 201) {
      // reset input
      setName("");
      setKode("");

      // show toast
      toast({
        title: "Yay",
        description: "Mapel baru berhasil ditambahkan",
      });
    }

    if (response.status === 200) {
      // reset input
      setName("");

      // show toast
      toast({
        title: "Yay",
        description: "Mapel berhasil diupdate",
      });
    }

    setDialogOpen(false);
  };

  useEffect(() => {
    setName(mapel ? mapel.nama : "");
    setKode(mapel ? mapel.kode : "");
  }, [mapel, setName, setKode]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={mapel ? `outline` : `default`} className="flex gap-3">
          {mapel ? (
            <IconEdit className="w-4 h-4" />
          ) : (
            <IconPlus className="w-5 h-5" />
          )}
          <span>{mapel ? "Edit" : "Buat Mapel Baru"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mapel ? "Edit Mapel" : "Buat Mapel Baru"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="col-span-12 mb-3 flex flex-col gap-2">
            <Label htmlFor="kode">Kode Mapel</Label>
            <Input
              id="kode"
              onInput={(e) => setKode(e.currentTarget.value)}
              placeholder="contoh: PJOK"
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") handleMapel();
              }}
              value={kode}
              autoFocus
            />
          </div>
          <div className="col-span-12 mb-3 flex flex-col gap-2">
            <Label htmlFor="name">Nama Mapel</Label>
            <Input
              id="name"
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="contoh: Pendidikan Jasmani Olahraga dan Kesehatan"
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") handleMapel();
              }}
              value={name}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={handleMapel}>
            {isLoading && <Loader className="mr-2 h-4 w-4" />}
            Save
          </Button>
          {/* add button delete */}
          {mapel && <DialogDeleteMapel mapel={mapel} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// dialog delete confirmation
export function DialogDeleteMapel({ mapel }: { mapel: Mapel }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteMapel = useMapel((state) => state.delete);

  // handle delete semester
  const handleDeleteSemester = async () => {
    setIsLoading(true);
    const response = await deleteMapel(mapel.id);

    if (response.status === 200) {
      setIsLoading(false);

      // show toast
      toast({
        title: "Yay",
        description: "Mapel berhasil dihapus",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex gap-3">
          <IconTrash className="w-4 h-4" />
          <span>Hapus</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Mapel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <DialogDescription>
              Apakah kamu yakin ingin menghapus Mapel ini?
            </DialogDescription>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDeleteSemester}
            disabled={isLoading}
          >
            {isLoading && <Loader className="mr-2 h-4 w-4" />}
            Hapus
          </Button>
          <Button variant={`ghost`} onClick={() => setDialogOpen(false)}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
