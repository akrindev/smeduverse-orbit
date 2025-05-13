"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Item {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  items: Item[];
  placeholder?: string;
  onSelected: (value: string) => void;
  defaultValue?: string;
  className?: string;
  showAll?: boolean;
}

// SearchableSelect Component - a searchable dropdown replacement for Select
export default function SearchableSelect({
  items,
  placeholder = "Select an option",
  onSelected,
  defaultValue = "",
  className,
  showAll = true,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState("");

  // For handling "All" option
  const allItemsOption = { value: "", label: "Semua" };

  // If showAll is true, add the "All" option to the items list
  const allItems = showAll ? [allItemsOption, ...items] : items;

  // Filter items based on search query
  const filteredItems = allItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected item label for display
  const selectedItem = allItems.find((item) => item.value === value);

  useEffect(() => {
    // Update the selected value when defaultValue changes
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("w-full justify-between", className)}
        onClick={() => setOpen(true)}
      >
        {selectedItem?.label || placeholder}
        <IconChevronDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 p-0 max-w-md">
          <Command shouldFilter={false} className="shadow-md border rounded-lg">
            <CommandInput
              placeholder={`Cari ${placeholder.toLowerCase()}...`}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue);
                      onSelected(currentValue);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {item.label}
                    {item.value === value && (
                      <IconCheck className="ml-auto w-4 h-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
