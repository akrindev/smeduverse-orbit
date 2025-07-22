"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonitoringPresenceClient from "./components/monitoring-presence-client";
import MonitoringJournalClient from "./components/monitoring-journal-client";

export default function MonitoringPage() {
  return (
    <div className="mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-semibold text-2xl">Pemantauan</h1>
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
