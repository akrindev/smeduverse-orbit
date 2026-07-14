"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { KelasAjar } from "@/types/modul";
import DialogConfirmDeleteKelasAjar from "./dialog-confirm-delete-kelas-ajar";

interface ContextMenuKelasAjarProps {
  children: React.ReactNode;
  kelasAjar: KelasAjar;
}

export default function ContextMenuKelasAjar({
  children,
  kelasAjar,
}: ContextMenuKelasAjarProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <DialogConfirmDeleteKelasAjar uuid={kelasAjar.uuid} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
