"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Grid } from "lucide-react";
import { useView, type ViewMode } from "@/store/useView";

interface ViewSwitcherProps {
  defaultView?: ViewMode;
  withLabels?: boolean;
}

export default function ViewSwitcher({ defaultView = "table", withLabels = false }: ViewSwitcherProps) {
  const { selectedView, setSelectedView } = useView();
  const [view, setView] = useState<ViewMode>(selectedView ?? defaultView);

  const handleViewChange = (newView: string) => {
    const nextView = newView as ViewMode;
    setView(nextView);
    setSelectedView(nextView);
  };

  return (
    <Tabs defaultValue={view} onValueChange={handleViewChange}>
      <TabsList>
        <TabsTrigger value="table">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4" />
            {withLabels && <span className="text-xs md:text-sm">Tabel</span>}
          </div>
        </TabsTrigger>
        <TabsTrigger value="grid">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4" />
            {withLabels && <span className="text-xs md:text-sm">Grid</span>}
          </div>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
