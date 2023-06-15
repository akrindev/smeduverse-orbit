import { Separator } from "@/components/ui/separator";
import TableSemester from "./components/table-semester";

export default function SemesterPage() {
  return (
    <div className="h-full flex flex-col space-y-5">
      <div className="flex flex-col h-full">
        <div className="mt-5 space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Semester</h2>
          <p className="text-sm text-muted-foreground">Kelola data semester</p>
        </div>
        <Separator className="my-4" />
        {/* table of semester that has title and status */}
        <TableSemester />
      </div>
    </div>
  );
}
