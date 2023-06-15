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
import { IconPlus } from "@tabler/icons-react";
import { set } from "date-fns";
import { Loader } from "lucide-react";
import { SyntheticEvent, useState } from "react";

export default function DialogCreateSemester() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refetchSemesters = useSemester((state) => state.refetch);

  const onStoreNewSemester = async () => {
    setIsLoading(true);
    // store new semester
    const response = await api
      .post("/semester/store", {
        name: name,
        is_active: 1,
      })
      .then((res) => {
        if (res.status === 201) {
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
      })
      .finally(() => setIsLoading(false));

    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={`default`} className="flex gap-3">
          <IconPlus className="w-5 h-5" />
          <span>Buat Semester Baru</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Semester Baru</DialogTitle>
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
                if (e.key === "Enter") onStoreNewSemester();
              }}
              autoFocus
            />
            <div className="text-sm text-gray-400">
              Semester yang baru ditambahkan akan menjadi semester aktif
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isLoading} onClick={onStoreNewSemester}>
            {isLoading && <Loader className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
