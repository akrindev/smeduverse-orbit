"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Grid } from "lucide-react";

interface ViewSwitcherProps {
  onViewChange: (view: "table" | "grid") => void;
}

export default function ViewSwitcher({ onViewChange }: ViewSwitcherProps) {
  const [view, setView] = useState("table");

  const handleViewChange = (newView: string) => {
    setView(newView);
    onViewChange(newView as "table" | "grid");
  };

  return (
    <Tabs defaultValue={view} onValueChange={handleViewChange}>
      <TabsList>
        <TabsTrigger value="table">
          <List className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger value="grid">
          <Grid className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
