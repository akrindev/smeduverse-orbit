"use client";

import { useEffect, useState } from "react";
import { useSemester } from "@/store/useSemester";
import { Semester } from "@/types/semester";
import SearchableSelect from "./searchable-select";
import BaseLoading from "@/components/base-loading";

interface SearchableSemesterSelectProps {
  onSelected: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function SearchableSemesterSelect({
  onSelected,
  defaultValue = "",
  className,
}: SearchableSemesterSelectProps) {
  const [semesters, refetch] = useSemester((state) => [
    state.semesters,
    state.refetch,
  ]);
  const [semesterItems, setSemesterItems] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (semesters) {
      const items = semesters.map((semester: Semester) => ({
        value: semester.id.toString(),
        label: semester.name,
      }));
      setSemesterItems(items);
    }
  }, [semesters]);

  if (loading) {
    return <BaseLoading />;
  }

  return (
    <SearchableSelect
      items={semesterItems}
      placeholder="Pilih Semester"
      onSelected={onSelected}
      defaultValue={defaultValue}
      className={className}
      showAll={true}
    />
  );
}
