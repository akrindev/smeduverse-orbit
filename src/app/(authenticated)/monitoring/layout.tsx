import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemantauan",
  description: "Pantau sesi presensi dan jurnal guru secara real-time",
};

export default function MonitoringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
