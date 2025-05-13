"use client";

import { useEffect, useState } from "react";
import { useMapel } from "@/store/useMapel";
import { Mapel } from "@/types/modul";
import SearchableSelect from "./searchable-select";
import BaseLoading from "@/components/base-loading";

interface SearchableMapelSelectProps {
  onSelected: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export default function SearchableMapelSelect({
  onSelected,
  defaultValue = "",
  className,
}: SearchableMapelSelectProps) {
  const [mapels, refetch] = useMapel((state) => [state.mapels, state.refetch]);
  const [mapelItems, setMapelItems] = useState<
    { value: string; label: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (mapels) {
      const items = mapels.map((mapel: Mapel) => ({
        value: mapel.id.toString(),
        label: `${mapel.kode} - ${mapel.nama}`,
      }));
      setMapelItems(items);
    }
  }, [mapels]);

  if (loading) {
    return <BaseLoading />;
  }

  return (
    <SearchableSelect
      items={mapelItems}
      placeholder="Pilih Mapel"
      onSelected={onSelected}
      defaultValue={defaultValue}
      className={className}
      showAll={true}
    />
  );
}
