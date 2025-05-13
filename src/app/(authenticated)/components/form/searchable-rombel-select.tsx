"use client";

import { useEffect, useState } from "react";
import { useRombel } from "@/store/useRombel";
import { Rombel } from "@/types/modul";
import SearchableSelect from "./searchable-select";
import BaseLoading from "@/components/base-loading";

interface SearchableRombelSelectProps {
  onSelected: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function SearchableRombelSelect({
  onSelected,
  defaultValue = "",
  className,
}: SearchableRombelSelectProps) {
  const [rombels, refetch] = useRombel((state) => [
    state.rombels,
    state.refetch,
  ]);
  const [rombelItems, setRombelItems] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch]);

  useEffect(() => {
    if (rombels) {
      const items = rombels.map((rombel: Rombel) => ({
        value: rombel.id,
        label: rombel.nama,
      }));
      setRombelItems(items);
    }
  }, [rombels]);

  if (loading) {
    return <BaseLoading />;
  }

  return (
    <SearchableSelect
      items={rombelItems}
      placeholder="Pilih Rombel"
      onSelected={onSelected}
      defaultValue={defaultValue}
      className={className}
      showAll={true}
    />
  );
}
