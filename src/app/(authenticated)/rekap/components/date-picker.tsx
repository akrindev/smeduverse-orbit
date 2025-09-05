"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

export function DatePickerWithRange({
	className,
	onSelect,
}: {
	className?: string;
	onSelect: (date: DateRange | undefined) => void;
}) {
	const [date, setDate] = useState<DateRange | undefined>({
		from: subDays(new Date(), 6),
		to: new Date(),
	});

	useEffect(() => {
		onSelect(date);
	}, [date]);

	return (
		<div className={cn("gap-2 grid", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"justify-start w-[300px] font-normal text-left",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 w-4 h-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="p-0 w-auto" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						max={6}
						disabled={(date) =>
							date > new Date() || date < new Date("2022-01-01")
						}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
