import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconInfoCircle } from "@tabler/icons-react";

export default function MataPelajaranPage() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mt-5 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Mata Pelajaran
            </h2>
            <p className="text-sm text-muted-foreground">
              Kelola data Mata Pelajaran
            </p>
          </div>
          {/* dialog */}
        </div>
        <Separator className="my-4" />
        <Alert>
          <IconInfoCircle className="w-5 h-5 mr-2" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Kelola data mata pelajaran.</AlertDescription>
        </Alert>
        <div className="my-4"></div>
        {/* table */}
      </div>
    </div>
  );
}
