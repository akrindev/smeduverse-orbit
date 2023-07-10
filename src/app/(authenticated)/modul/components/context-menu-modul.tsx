"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Modul } from "@/types/modul";
import DialogConfirmDeleteModul from "./dialog-confirm-delete-modul";

interface ContextMenuModulProps {
  children: React.ReactNode;
  modul: Modul;
}

export default function ContextMenuModul({
  children,
  modul,
}: ContextMenuModulProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <DialogConfirmDeleteModul uuid={modul.uuid} />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
