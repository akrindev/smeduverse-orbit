"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
  onSelect: (dateRange: DateRange | undefined) => void;
  initialDateRange?: DateRange;
}

export function DateRangeSelector({
  onSelect,
  initialDateRange,
}: DateRangePickerProps) {
  // Track start and end dates independently
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialDateRange?.from
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialDateRange?.to
  );

  // Update parent component whenever either date changes
  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onSelect({
      from: date,
      to: endDate,
    });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onSelect({
      from: startDate,
      to: date,
    });
  };

  return (
    <div className="flex md:flex-row flex-col md:space-x-4 space-y-4 md:space-y-0">
      {/* Start Date Picker */}
      <div className="space-y-2">
        <Label htmlFor="start-date">Tanggal Mulai</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="start-date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 w-4 h-4" />
              {startDate ? (
                format(startDate, "PPP")
              ) : (
                <span>Pilih tanggal mulai</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              initialFocus
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date Picker */}
      <div className="space-y-2">
        <Label htmlFor="end-date">Tanggal Akhir</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="end-date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 w-4 h-4" />
              {endDate ? (
                format(endDate, "PPP")
              ) : (
                <span>Pilih tanggal akhir</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateChange}
              initialFocus
              disabled={(date) => date > new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
