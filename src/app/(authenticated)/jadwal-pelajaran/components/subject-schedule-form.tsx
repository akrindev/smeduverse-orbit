"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  useSubjectSchedule,
  SubjectSchedule,
} from "@/store/useSubjectSchedule";

// Validation schema for subject schedule
const formSchema = z.object({
  subject_key: z.coerce.number().min(0, "Subject key is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface SubjectScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scheduleToEdit?: SubjectSchedule;
}

export function SubjectScheduleForm({
  open,
  onOpenChange,
  scheduleToEdit,
}: SubjectScheduleFormProps) {
  const { addSchedule, updateSchedule } = useSubjectSchedule();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject_key: scheduleToEdit?.subject_key || 0,
      start_time: scheduleToEdit?.start_time || "",
      end_time: scheduleToEdit?.end_time || "",
    },
  });

  // Update form values when scheduleToEdit changes
  useEffect(() => {
    if (scheduleToEdit) {
      form.reset({
        subject_key: scheduleToEdit.subject_key,
        start_time: scheduleToEdit.start_time,
        end_time: scheduleToEdit.end_time,
      });
    } else {
      form.reset({
        subject_key: 0,
        start_time: "",
        end_time: "",
      });
    }
  }, [form, scheduleToEdit]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (scheduleToEdit) {
        // Update existing schedule
        await updateSchedule(scheduleToEdit.id, values);
        toast({
          title: "Jadwal berhasil diperbarui",
          description: `Jadwal untuk subject key ${values.subject_key} telah diperbarui.`,
        });
      } else {
        // Add new schedule
        await addSchedule(values);
        toast({
          title: "Jadwal berhasil ditambahkan",
          description: `Jadwal baru untuk subject key ${values.subject_key} telah ditambahkan.`,
        });
      }
      // Close the dialog
      onOpenChange(false);
      // Reset the form
      form.reset();
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan jadwal. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {scheduleToEdit
              ? "Edit Jadwal Pelajaran"
              : "Tambah Jadwal Pelajaran"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Key</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Mulai</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Selesai</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                )}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
