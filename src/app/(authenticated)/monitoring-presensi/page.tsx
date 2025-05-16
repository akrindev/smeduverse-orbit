"use client";

import MonitoringPresenceClient from "./components/monitoring-presence-client";

export default function MonitoringPresencePage() {
  return (
    <div className="mx-auto py-6">
      <h1 className="mb-6 font-semibold text-2xl">Monitoring Presensi</h1>
      <MonitoringPresenceClient />
    </div>
  );
}
