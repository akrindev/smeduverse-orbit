import { Separator } from "@/components/ui/separator";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    uuid: string;
  };
}) {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="mt-5 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Matematika</h2>
          <p className="text-sm text-muted-foreground">
            {/* list of all modul available */}
            Syakirin Amin - XI ATPH
          </p>
        </div>
        <Separator className="my-4" />
        {children}
      </div>
    </div>
  );
}
