"use client";

import { DatePicker } from "@/app/(authenticated)/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { usePresence } from "@/store/usePresence";
import { useSubjectSchedule } from "@/store/useSubjectSchedule";
import { IconEditCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import { format, parse, isBefore } from "date-fns";
import { Loader, InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEventHandler, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Utility to convert "HH:mm" string into a Date
const toDate = (t: string) => parse(t, "HH:mm", new Date());

export default function DialogPresensi({
  modulUuid,
  data,
}: {
  modulUuid: string;
  data?: {
    title: string;
    description: string;
    date: Date | string | number;
    presenceUuid?: string;
    subject_schedule_id?: number;
    subject_schedule_end_id?: number | null;
  };
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<Date | string | number>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uuid, setUuid] = useState<string>("");
  const [presenceUuid, setPresenceUuid] = useState<string>("");
  const [subjectScheduleId, setSubjectScheduleId] = useState<number | null>(
    null
  );
  const [subjectScheduleEndId, setSubjectScheduleEndId] = useState<
    number | null
  >(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [createPresence, updatePresence, destroyPresence] = usePresence(
    (state) => [
      state.createPresence,
      state.updatePresence,
      state.destroyPresence,
    ]
  );

  const {
    schedules,
    fetchSchedules,
    loading: loadingSchedules,
  } = useSubjectSchedule();

  const router = useRouter();

  // Handle change of start schedule
  const handleStartScheduleChange = (value: string) => {
    const newStartId = Number(value);
    setSubjectScheduleId(newStartId);
    setScheduleError(null); // Clear error when a valid selection is made

    // Check if we need to reset the end schedule
    if (subjectScheduleEndId) {
      const startSchedule = schedules.find((s) => s.id === newStartId);
      const endSchedule = schedules.find((s) => s.id === subjectScheduleEndId);

      if (
        startSchedule &&
        endSchedule &&
        isBefore(
          toDate(endSchedule.start_time),
          toDate(startSchedule.start_time)
        )
      ) {
        setSubjectScheduleEndId(null); // Reset end schedule if it's earlier than new start
      }
    }
  };

  // Validate on form submission only
  const validateSchedules = () => {
    if (!subjectScheduleId) {
      setScheduleError("Jadwal Mulai harus dipilih");
      return false;
    }

    if (subjectScheduleEndId) {
      // Find the selected schedules in the schedule array
      const startSchedule = schedules.find((s) => s.id === subjectScheduleId);
      const endSchedule = schedules.find((s) => s.id === subjectScheduleEndId);

      if (startSchedule && endSchedule) {
        // Compare start times using date-fns parsing for reliable comparison
        if (
          isBefore(
            toDate(endSchedule.start_time),
            toDate(startSchedule.start_time)
          )
        ) {
          setScheduleError(
            "Jadwal Selesai tidak boleh lebih awal dari Jadwal Mulai"
          );
          return false;
        }
      }
    }

    setScheduleError(null);
    return true;
  };

  // event on submit
  // must be prevent default
  const handleSubmitPresensi: FormEventHandler = async (e) => {
    e.preventDefault();

    // Validate schedules before submission
    if (!validateSchedules()) {
      return;
    }

    setIsLoading(true);

    const body = {
      title: title,
      description: description,
      date: format(date as Date, "yyyy-MM-dd"),
      orbit_modul_uuid: uuid,
      presence_uuid: presenceUuid,
      subject_schedule_id: subjectScheduleId,
      subject_schedule_end_id: subjectScheduleEndId,
    };

    const response = await (data
      ? updatePresence(body)
      : createPresence(body)
    ).finally(() => {
      setIsLoading(false);
    });

    // is success
    if (response.status !== 422) {
      // reset input
      setTitle("");
      setDescription("");
      setSubjectScheduleId(null);
      setSubjectScheduleEndId(null);

      // close dialog
      setOpen(false);
    }
  };

  // handle delete presensi
  const handleDeletePresensi = async () => {
    setIsLoading(true);

    const response = await destroyPresence(presenceUuid).finally(() => {
      setIsLoading(false);
    });

    // is success
    if (response.status !== 422) {
      // add toast
      toast({
        title: "Berhasil menghapus presensi",
        description: "Presensi berhasil dihapus",
      });

      // redirect to modul
      router.push(`/modul/${modulUuid}`);
    }
  };

  useEffect(() => {
    if (modulUuid) {
      setUuid(modulUuid);
    }

    if (data) {
      // console.log(data);

      setTitle(data.title);
      setDescription(data.description);
      setDate(data.date);
      setPresenceUuid(data.presenceUuid || "");
      setSubjectScheduleId(data.subject_schedule_id || null);
      setSubjectScheduleEndId(data.subject_schedule_end_id || null);
    }

    // Fetch schedules when component mounts
    fetchSchedules();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">
          {data ? (
            <IconEditCircle className="mr-2 w-4 h-4" />
          ) : (
            <IconPlus className="mr-2 w-4 h-4" />
          )}
          {data ? "Edit" : "Buat"} Presensi
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmitPresensi}>
          <DialogHeader>
            <DialogTitle>{data ? "Edit" : "Buat"} Presensi</DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="gap-4 grid grid-cols-12 py-4">
            <div className="gap-2 col-span-12">
              <Label htmlFor="title">
                Judul Presensi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                onInput={(e) => setTitle(e.currentTarget.value)}
                placeholder="Judul Presensi"
                disabled={isLoading}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") handleSubmitPresensi(e);
                }}
                value={title}
                autoFocus
                required
              />
            </div>
            <div className="gap-2 col-span-12">
              <Label htmlFor="description">
                Deskripsi Presensi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                onInput={(e) => setDescription(e.currentTarget.value)}
                placeholder="Deskripsi Presensi"
                disabled={isLoading}
                value={description}
                required
              />
            </div>
            {/* date picker that indicate date of presence */}
            <div className="flex flex-col gap-2 col-span-12">
              <Label htmlFor="date">
                Tanggal Presensi <span className="text-red-500">*</span>
              </Label>
              <DatePicker selectedDate={data?.date} onSelect={setDate} />
            </div>
            {/* Subject schedule from */}
            <div className="flex flex-col gap-2 col-span-12">
              <Label htmlFor="scheduleFrom">
                Jadwal Mulai <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={isLoading || loadingSchedules}
                value={subjectScheduleId?.toString() || ""}
                onValueChange={handleStartScheduleChange}
                required
              >
                <SelectTrigger id="scheduleFrom">
                  <SelectValue placeholder="Pilih Jadwal Mulai" />
                </SelectTrigger>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem
                      key={schedule.id}
                      value={schedule.id.toString()}
                    >
                      Jam ke {schedule.subject_key} | {schedule.start_time} -{" "}
                      {schedule.end_time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Subject schedule to (optional) */}
            <div className="flex flex-col gap-2 col-span-12">
              <Label htmlFor="scheduleTo">Jadwal Selesai (Opsional)</Label>
              <Select
                disabled={isLoading || loadingSchedules || !subjectScheduleId}
                value={subjectScheduleEndId?.toString() || ""}
                onValueChange={(value) => {
                  const newValue = value === "null" ? null : Number(value);
                  setSubjectScheduleEndId(newValue);

                  // Only validate end schedule if a value other than "null" is selected
                  if (value !== "null") {
                    const startSchedule = schedules.find(
                      (s) => s.id === subjectScheduleId
                    );
                    const endSchedule = schedules.find(
                      (s) => s.id === Number(value)
                    );

                    if (
                      startSchedule &&
                      endSchedule &&
                      isBefore(
                        toDate(endSchedule.start_time),
                        toDate(startSchedule.start_time)
                      )
                    ) {
                      setScheduleError(
                        "Jadwal Selesai tidak boleh lebih awal dari Jadwal Mulai"
                      );
                    } else {
                      setScheduleError(null);
                    }
                  } else {
                    setScheduleError(null);
                  }
                }}
              >
                <SelectTrigger id="scheduleTo">
                  <SelectValue placeholder="Pilih Jadwal Selesai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="null">Tidak Ada</SelectItem>
                  {schedules
                    .filter((schedule) => {
                      // Show only schedules that have start time >= the selected start schedule
                      if (!subjectScheduleId) return true;
                      const startSchedule = schedules.find(
                        (s) => s.id === subjectScheduleId
                      );
                      return (
                        startSchedule &&
                        !isBefore(
                          toDate(schedule.start_time),
                          toDate(startSchedule.start_time)
                        )
                      );
                    })
                    .map((schedule) => (
                      <SelectItem
                        key={schedule.id}
                        value={schedule.id.toString()}
                      >
                        Jam ke {schedule.subject_key} | {schedule.start_time} -{" "}
                        {schedule.end_time}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {scheduleError && (
                <p className="mt-1 text-red-500 text-sm">{scheduleError}</p>
              )}
              <Alert variant="default" className="mt-2">
                <InfoIcon className="w-4 h-4" />
                <AlertDescription>
                  Jika jam pelajaran hanya 1 jam saja maka jam selesai tidak
                  perlu diisi atau dipilih
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isLoading || !!scheduleError || !subjectScheduleId}
              type="submit"
            >
              {isLoading && <Loader className="mr-2 w-4 h-4" />}
              Save
            </Button>
            {/* add button delete */}
            {data && (
              <DialogDeletePresensi
                onDestroy={handleDeletePresensi}
                isLoading={isLoading}
              />
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DialogDeletePresensi({ onDestroy, isLoading }) {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex gap-3">
          <IconTrash className="w-4 h-4" />
          <span>Hapus</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Presensi</DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <div className="gap-2 grid">
            <DialogDescription>
              Apakah kamu yakin ingin menghapus presensi ini?
            </DialogDescription>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onDestroy}
            disabled={isLoading}
          >
            {isLoading && <Loader className="mr-2 w-4 h-4" />}
            Hapus
          </Button>
          <Button variant={`ghost`} onClick={() => setDialogOpen(false)}>
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
