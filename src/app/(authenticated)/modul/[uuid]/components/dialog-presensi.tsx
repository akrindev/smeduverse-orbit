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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { usePresence } from "@/store/usePresence";
import { IconEditCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { Router } from "next/router";
import { FormEventHandler, useEffect, useState } from "react";

export default function DialogPresensi({
  modulUuid,
  data,
}: {
  modulUuid: string;
  data?: {
    title: string;
    description: string;
    presenceUuid?: string;
  };
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [presenceUuid, setPresenceUuid] = useState<string>("");

  const [createPresence, updatePresence, destroyPresence] = usePresence(
    (state) => [
      state.createPresence,
      state.updatePresence,
      state.destroyPresence,
    ]
  );

  const router = useRouter();

  // event on submit
  // must be prevent default
  const handleSubmitPresensi: FormEventHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      title: title,
      description: description,
      orbit_modul_uuid: uuid,
      presence_uuid: presenceUuid,
    };

    const response = await (data
      ? updatePresence(body)
      : createPresence(body)
    ).finally(() => {
      setIsLoading(false);
    });

    // is success
    if (response.status !== 422) {
      // reset input
      setTitle("");
      setDescription("");

      // close dialog
      setOpen(false);
    }
  };

  // handle delete presensi
  const handleDeletePresensi = async () => {
    setIsLoading(true);

    const response = await destroyPresence(presenceUuid).finally(() => {
      setIsLoading(false);
    });

    // is success
    if (response.status !== 422) {
      // add toast
      toast({
        title: "Berhasil menghapus presensi",
        description: "Presensi berhasil dihapus",
      });

      // redirect to modul
      router.push(`/modul/${modulUuid}`);
    }
  };

  useEffect(() => {
    setUuid(modulUuid);

    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setPresenceUuid(data.presenceUuid || "");
    }
  }, [modulUuid, data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          {data ? (
            <IconEditCircle className="w-4 h-4 mr-2" />
          ) : (
            <IconPlus className="w-4 h-4 mr-2" />
          )}
          {data ? "Edit" : "Buat"} Presensi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmitPresensi}>
          <DialogHeader>
            <DialogTitle>{data ? "Edit" : "Buat"} Presensi</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid grid-cols-12 gap-4 py-4">
            <div className="col-span-12 gap-2">
              <Label htmlFor="title">Judul Presensi</Label>
              <Input
                id="title"
                onInput={(e) => setTitle(e.currentTarget.value)}
                placeholder="Judul Presensi"
                disabled={isLoading}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") handleSubmitPresensi(e);
                }}
                value={title}
                autoFocus
                required
              />
            </div>
            <div className="col-span-12 gap-2">
              <Label htmlFor="description">Deskripsi Presensi</Label>
              <Textarea
                id="description"
                onInput={(e) => setDescription(e.currentTarget.value)}
                placeholder="Deskripsi Presensi"
                disabled={isLoading}
                value={description}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader className="mr-2 h-4 w-4" />}
              Save
            </Button>
            {/* add button delete */}
            {data && (
              <DialogDeletePresensi
                onDestroy={handleDeletePresensi}
                isLoading={isLoading}
              />
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DialogDeletePresensi({ onDestroy, isLoading }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
          <DialogTitle>Hapus Presensi</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <DialogDescription>
              Apakah kamu yakin ingin menghapus presensi ini?
            </DialogDescription>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onDestroy}
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
