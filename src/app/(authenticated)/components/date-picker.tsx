"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  className,
  onSelect,
  selectedDate,
}: {
  className?: string;
  selectedDate?: Date | string | number;
  onSelect: (date: Date) => void;
}) {
  const [date, setDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    if (date) {
      onSelect(date);
    }
  }, [date, onSelect]);

  React.useEffect(() => {
    if (selectedDate) {
      setDate(new Date(selectedDate) as Date);
    }
  }, [selectedDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 w-4 h-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day: Date | undefined) => day && setDate(day)}
          initialFocus
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  );
}
