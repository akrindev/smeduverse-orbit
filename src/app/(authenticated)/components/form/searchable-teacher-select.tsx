"use client";

import { useEffect, useState } from "react";
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
  const [teacherItems, setTeacherItems] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (teachers) {
      const items = teachers.map((teacher: Teacher) => ({
        value: teacher.teacher_id,
        label: `${teacher.fullname} (${teacher.niy})`,
      }));
      setTeacherItems(items);
    }
  }, [teachers]);

  if (isLoading) {
    return <BaseLoading />;
  }

  return (
    <SearchableSelect
      items={teacherItems}
      placeholder="Pilih Guru"
      onSelected={onSelected}
      defaultValue={defaultValue}
      className={className}
      showAll={true}
    />
  );
}
