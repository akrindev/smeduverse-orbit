"use client";

import { useCallback, useMemo } from "react";
import { useUserQuery } from "@/store/useUser";
import { Teacher } from "@/types/modul";
import SearchableSelect from "./searchable-select";
import BaseLoading from "@/components/base-loading";

interface SearchableTeacherSelectProps {
  onSelected: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function SearchableTeacherSelect({
  onSelected,
  defaultValue = "",
  className,
}: SearchableTeacherSelectProps) {
  const { teachers, isLoading } = useUserQuery();

  // Convert teachers to format needed by SearchableSelect directly with useMemo
  const teacherItems = useMemo(() => {
    if (!teachers) return [];
    return teachers.map((teacher: Teacher) => ({
      value: teacher.teacher_id,
      label: `${teacher.fullname} (${teacher.niy})`,
    }));
  }, [teachers]);

  // Create a properly memoized handler
  const handleSelected = useCallback(
    (value: string) => {
      onSelected(value);
    },
    [onSelected]
  );

  if (isLoading) {
    return <BaseLoading />;
  }

  return (
    <SearchableSelect
      items={teacherItems}
      placeholder="Pilih Guru"
      onSelected={handleSelected}
      defaultValue={defaultValue}
      className={className}
      showAll={true}
    />
  );
}
