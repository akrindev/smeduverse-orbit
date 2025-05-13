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
import { useSemester } from "@/store/useSemester";
import { Semester } from "@/types/semester";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function DialogSemester({ semester }: { semester?: Semester }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [store, update] = useSemester((state) => [state.store, state.update]);

  const handleSemester = async () => {
    setIsLoading(true);

    const body = {
      name: name,
      is_active: 1,
    };
    // if semester is not null, update semester
    const response = semester
      ? await update(semester.id, body)
      : await store(body);

    if (response.status === 201) {
      // reset input
      setName("");

      // show toast
      toast({
        title: "Yay",
        description: "Semester baru berhasil ditambahkan",
      });
    }

    if (response.status === 200) {
      // show toast
      toast({
        title: "Yay",
        description: "Semester berhasil diupdate",
      });
    }

    setIsLoading(false);

    setDialogOpen(false);
  };

  useEffect(() => {
    setName(semester ? semester.name : "");
  }, [semester, setName]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={semester ? `outline` : `default`}
          className="flex gap-3"
        >
          {semester ? (
            <IconEdit className="w-4 h-4" />
          ) : (
            <IconPlus className="w-5 h-5" />
          )}
          <span>{semester ? "Edit" : "Buat Semester Baru"}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {semester ? "Edit Semester" : "Buat Semester Baru"}
          </DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <div className="gap-2 grid">
            <Label htmlFor="name">Judul Semester</Label>
            <Input
              id="name"
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="contoh: 2022/2023-ganjil"
              disabled={isLoading}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") handleSemester();
              }}
              value={name}
              autoFocus
            />
            <div className="text-gray-400 text-sm">
              Semester yang baru ditambahkan akan menjadi semester aktif
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSemester}>
            {isLoading && <Loader className="mr-2 w-4 h-4" />}
            Save
          </Button>
          {/* add button delete */}
          {semester && <DialogDeleteSemester semester={semester} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// dialog delete confirmation
export function DialogDeleteSemester({ semester }: { semester: Semester }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteSemester = useSemester((state) => state.delete);

  // handle delete semester
  const handleDeleteSemester = async () => {
    setIsLoading(true);
    const response = await deleteSemester(semester.id);

    if (response.status === 200) {
      setIsLoading(false);

      // show toast
      toast({
        title: "Yay",
        description: "Semester berhasil dihapus",
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
          <DialogTitle>Hapus Semester</DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <div className="gap-2 grid">
            <DialogDescription>
              Apakah kamu yakin ingin menghapus semester ini?
            </DialogDescription>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDeleteSemester}
            disabled={isLoading}
          >
            {isLoading && <Loader className="mr-2 w-4 h-4" />}
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
