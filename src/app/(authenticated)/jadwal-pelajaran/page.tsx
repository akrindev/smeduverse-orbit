"use client";

import { Button } from "@/components/ui/button";
import {
	type SubjectSchedule,
	useSubjectSchedulesQuery,
} from "@/queries/useSubjectScheduleQuery";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { SubjectScheduleForm } from "./components/subject-schedule-form";
import { SubjectScheduleTable } from "./components/subject-schedule-table";

export default function JadwalPelajaranPage() {
	const [formOpen, setFormOpen] = useState(false);
	const [scheduleToEdit, setScheduleToEdit] = useState<
		SubjectSchedule | undefined
	>(undefined);
	const { isLoading, refetch } = useSubjectSchedulesQuery();
	const [refreshing, setRefreshing] = useState(false);

	const handleAddSchedule = () => {
		setScheduleToEdit(undefined);
		setFormOpen(true);
	};

	const handleEditSchedule = (schedule: SubjectSchedule) => {
		setScheduleToEdit(schedule);
		setFormOpen(true);
	};

	const handleRefresh = async () => {
		setRefreshing(true);
		await refetch();
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
						disabled={isLoading || refreshing}
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
			<SubjectScheduleTable onEdit={handleEditSchedule} />

			<SubjectScheduleForm
				open={formOpen}
				onOpenChange={setFormOpen}
				scheduleToEdit={scheduleToEdit}
			/>
		</div>
	);
}
