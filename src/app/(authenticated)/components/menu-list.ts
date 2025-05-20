import {
  IconBooks,
  IconCalendar,
  IconGridPattern,
  IconListDetails,
  IconPlayerPlay,
  IconReportAnalytics,
  IconUserCheck,
  IconNotes,
} from "@tabler/icons-react";

// list of sidebar menu
interface MenuItem {
  name: string;
  title?: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  path: string;
  separator?: boolean;
  roles?: string[]; // role that can access this menu
}

// {
//       title: "Playground",
//       url: "#",
//       icon: SquareTerminal,
//       isActive: true,
//       items: [
//         {
//           title: "History",
//           url: "#",
//         },
//         {
//           title: "Starred",
//           url: "#",
//         },
//         {
//           title: "Settings",
//           url: "#",
//         },
//       ],
//     },

export const menuList: MenuItem[] = [
  {
    name: "Dashboard",
    title: "Dashboard",
    icon: IconPlayerPlay,
    path: "/dashboard",
  },
  {
    name: "Modul",
    title: "Modul",
    icon: IconGridPattern,
    path: "/modul",
  },
  {
    name: "Monitoring Presensi",
    title: "Monitoring Presensi",
    icon: IconUserCheck,
    path: "/monitoring-presensi",
  },
  {
    name: "Jurnal Guru",
    title: "Jurnal Guru",
    icon: IconNotes,
    path: "/jurnal-guru",
  },
  {
    name: "Rekap Laporan",
    title: "Rekap Laporan",
    icon: IconReportAnalytics,
    path: "/rekap",
  },
  {
    name: "separator",
    title: "separator",
    icon: IconPlayerPlay,
    path: "/",
    separator: true,
    roles: ["waka kurikulum"],
  },
  {
    name: "Semester",
    title: "Semester",
    icon: IconListDetails,
    path: "/semester",
    roles: ["waka kurikulum"],
  },
  {
    name: "Jadwal Jam Pelajaran",
    title: "Jadwal Jam Pelajaran",
    icon: IconCalendar,
    path: "/jadwal-pelajaran",
    roles: ["waka kurikulum"],
  },
  {
    name: "Mata Pelajaran",
    title: "Mata Pelajaran",
    icon: IconBooks,
    path: "/mata-pelajaran",
    roles: ["waka kurikulum"],
  },
];
