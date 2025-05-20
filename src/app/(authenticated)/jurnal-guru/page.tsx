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

export default function TeacherJournalPage() {
  // Filters state
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  // Get current user and teacher journals from store
  const { user: currentUser } = useAuth();
  const { getTeacherJournals, journals, isLoading } = useTeacherJournal();

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
      });
    }
  }, [selectedTeacher, dateRange, getTeacherJournals]);

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
      ) : (
        <TeacherJournalTable journals={journals?.data || []} />
      )}
    </div>
  );
}
