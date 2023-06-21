"use client";

import { useEffect, useState } from "react";
import DialogPresensi from "../../../components/dialog-presensi";

export default function Information({
  title,
  description,
  modulUuid,
  presenceUuid,
}: {
  title: string;
  description: string;
  modulUuid: string;
  presenceUuid?: string;
}) {
  // handle data state
  const [data, setData] = useState<{
    title: string;
    description: string;
    presenceUuid?: string;
  }>();

  useEffect(() => {
    setData({
      title: title,
      description: description,
      presenceUuid: presenceUuid,
    });
  }, [title, description, presenceUuid]);

  return (
    <div className="grid grid-cols-12">
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Judul</div>
        <div className="text-sm text-muted-foreground">{data?.title}</div>
      </div>
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Deskripsi</div>
        <div className="text-sm text-muted-foreground">{data?.description}</div>
      </div>
      <div className="mt-3 flex items-center justify-end col-span-12">
        <DialogPresensi modulUuid={modulUuid} data={data!} />
      </div>
    </div>
  );
}
