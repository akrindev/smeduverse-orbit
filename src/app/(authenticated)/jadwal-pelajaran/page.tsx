"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { SubjectScheduleTable } from "./components/subject-schedule-table";
import { SubjectScheduleForm } from "./components/subject-schedule-form";
import {
  SubjectSchedule,
  useSubjectSchedule,
} from "@/store/useSubjectSchedule";

export default function JadwalPelajaranPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<
    SubjectSchedule | undefined
  >(undefined);
  const { fetchSchedules, loading } = useSubjectSchedule();
  const [refreshing, setRefreshing] = useState(false);

  // Handle opening the form for adding a new schedule
  const handleAddSchedule = () => {
    setScheduleToEdit(undefined);
    setFormOpen(true);
  };

  // Handle opening the form for editing an existing schedule
  const handleEditSchedule = (schedule: SubjectSchedule) => {
    setScheduleToEdit(schedule);
    setFormOpen(true);
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSchedules();
    setRefreshing(false);
  };

  return (
    <div className="space-y-4 pt-5">
      <div className="flex justify-between items-center space-y-2">
        <h2 className="font-bold text-3xl tracking-tight">Jadwal Pelajaran</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || refreshing}
          >
            {refreshing ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 w-4 h-4" />
            )}
            Refresh
          </Button>
          <Button onClick={handleAddSchedule}>
            <Plus className="mr-2 w-4 h-4" />
            Tambah Jadwal
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jadwal Pelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          <SubjectScheduleTable onEdit={handleEditSchedule} />
        </CardContent>
      </Card>

      <SubjectScheduleForm
        open={formOpen}
        onOpenChange={setFormOpen}
        scheduleToEdit={scheduleToEdit}
      />
    </div>
  );
}
