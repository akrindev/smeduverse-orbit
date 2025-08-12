"use client";

import { useState } from "react";
import { format } from "date-fns";
import { IconDownload } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonitoringPresenceClient from "./components/monitoring-presence-client";
import MonitoringJournalClient from "./components/monitoring-journal-client";
import { api } from "@/lib/api";

export default function MonitoringPage() {
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  const handleExportToday = async () => {
    try {
      setExportLoading(true);
      const response = await api.get(`/modul/presence/recap/export/today`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const todayStr = format(new Date(), "yyyy-MM-dd");
      link.setAttribute("download", `rekap-presensi-hari-ini-${todayStr}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-semibold text-2xl">Pemantauan</h1>
        <Button variant="outline" onClick={handleExportToday} disabled={exportLoading}>
          {exportLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex items-center gap-2">
              Unduh
              <IconDownload className="w-4 h-4" />
            </div>
          )}
        </Button>
      </div>
      <Tabs defaultValue="presence">
        <TabsList>
          <TabsTrigger value="presence">Presensi</TabsTrigger>
          <TabsTrigger value="journal">Jurnal Guru</TabsTrigger>
        </TabsList>
        <TabsContent value="presence">
          <MonitoringPresenceClient />
        </TabsContent>
        <TabsContent value="journal">
          <MonitoringJournalClient />
        </TabsContent>
      </Tabs>
    </div>
  );
}
