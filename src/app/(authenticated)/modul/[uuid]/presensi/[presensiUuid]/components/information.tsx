"use client";

export default function Information({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className="grid grid-cols-12">
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Judul</div>
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
      <div className="space-y-1 col-span-12 md:col-span-6">
        <div className="font-medium">Deskripsi</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
    </div>
  );
}
