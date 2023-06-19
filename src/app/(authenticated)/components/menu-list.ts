import {
  IconBooks,
  IconGridPattern,
  IconListDetails,
  IconPlayerPlay,
  IconReportAnalytics,
} from "@tabler/icons-react";

// list of sidebar menu
interface MenuItem {
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  separator?: boolean;
}

export const menuList: MenuItem[] = [
  {
    name: "Dashboard",
    icon: IconPlayerPlay,
    path: "/dashboard",
  },
  {
    name: "Modul",
    icon: IconGridPattern,
    path: "/modul",
  },
  {
    name: "Rekap Laporan",
    icon: IconReportAnalytics,
    path: "/rekap",
  },
  {
    name: "separator",
    icon: IconPlayerPlay,
    path: "/",
    separator: true,
  },
  {
    name: "Semester",
    icon: IconListDetails,
    path: "/semester",
  },
  {
    name: "Mata Pelajaran",
    icon: IconBooks,
    path: "/mata-pelajaran",
  },
];
