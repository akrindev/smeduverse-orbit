"use client";

import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import SearchableTeacherSelect from "../components/form/searchable-teacher-select";
import TeacherJournalTable from "./components/teacher-journal-table";
import { useTeacherJournal } from "@/store/useTeacherJournal";
import BaseLoading from "@/components/base-loading";
import { useAuth, User } from "@/store/useAuth";
import { DateRangeSelectorPair } from "./components/date-range-picker";
import PaginationControls from "@/components/pagination-controls";

export default function TeacherJournalPage() {
  // Filters state
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [page, setPage] = useState(1);

  // Get current user and teacher journals from store
  const { user: currentUser } = useAuth();
  const { getTeacherJournals, journals, isLoading, currentPage, lastPage } =
    useTeacherJournal();

  // On initial load, set the selected teacher to current user if they are a teacher
  useEffect(() => {
    if (currentUser?.teacher?.teacher_id) {
      setSelectedTeacher(currentUser.teacher.teacher_id);
    }
  }, [currentUser]);

  // Fetch journals when filters change
  useEffect(() => {
    if (selectedTeacher) {
      getTeacherJournals({
        teacher_id: selectedTeacher,
        from: dateRange?.from || new Date(),
        to: dateRange?.to || null,
        page,
      });
    }
  }, [selectedTeacher, dateRange, page, getTeacherJournals]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Scroll to top of page
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex md:flex-row flex-col justify-between">
        <div className="space-y-1 mt-5">
          <h2 className="font-semibold text-2xl tracking-tight">Jurnal Guru</h2>
          <p className="text-muted-foreground text-sm">
            Rekap jurnal kegiatan pembelajaran per guru
          </p>
        </div>
      </div>
      <Separator className="my-5" />

      {/* Filters */}
      <div className="gap-5 grid grid-cols-12 mb-5">
        <div className="col-span-12 md:col-span-3">
          <div className="mb-3 font-medium">Pilih Guru</div>
          <SearchableTeacherSelect
            onSelected={setSelectedTeacher}
            defaultValue={selectedTeacher}
          />
        </div>

        <div className="col-span-12 md:col-span-9">
          <DateRangeSelectorPair
            onSelect={setDateRange}
            initialDateRange={dateRange}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <BaseLoading />
      ) : !selectedTeacher ? (
        <div className="flex flex-col items-center bg-yellow-50 my-8 p-8 border rounded-md">
          <h3 className="mb-2 font-semibold text-yellow-800 text-lg">
            Pilih Guru Terlebih Dahulu
          </h3>
          <p className="text-yellow-700 text-center">
            Silakan pilih guru untuk menampilkan jurnal guru.
          </p>
        </div>
      ) : (
        <>
          <TeacherJournalTable journals={journals?.data || []} />

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <PaginationControls
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
