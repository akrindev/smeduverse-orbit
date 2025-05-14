import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pemantauan Presensi",
  description: "Pantau sesi presensi aktif di semua kelas",
};

export default function MonitoringPresenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
