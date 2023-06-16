"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUser } from "@/store/useUser";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import SelectTeacher from "../../components/form/select-teacher";
import SelectRombel from "../../components/form/select-rombel";

export default function DialogModul() {
  return (
    <Dialog>
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
            <SelectRombel />
          </div>
          <div className="grid gap-2">
            <label htmlFor="name">Pilih Guru</label>
            <SelectTeacher />
          </div>
          <div className="grid gap-2">
            <label htmlFor="name">Pilih Mapel</label>
            {/*  */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
