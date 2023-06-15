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
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useSemester } from "@/store/useSemester";
import { Semester } from "@/types/semester";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function DialogSemester({ semester }: { semester?: Semester }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refetchSemesters = useSemester((state) => state.refetch);

  const handleSemester = async () => {
    setIsLoading(true);

    const body = {
      name: name,
      is_active: 1,
    };
    // if semester is not null, update semester
    const response = semester
      ? await api.put(`/semester/update/${semester.id}`, body)
      : await api.post("/semester/store", body);

    if (response.status === 201) {
      // refetch semesters
      refetchSemesters();

      // reset input
      setName("");

      // show toast
      toast({
        title: "Yay",
        description: "Semester baru berhasil ditambahkan",
      });
    }

    if (response.status === 200) {
      // refetch semesters
      refetchSemesters();

      // reset input
      setName("");

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
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
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
            <div className="text-sm text-gray-400">
              Semester yang baru ditambahkan akan menjadi semester aktif
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={handleSemester}>
            {isLoading && <Loader className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
