import ThemeSwitcher from "@/components/theme-switcher";
import { BottomNavbar } from "./components/bottom-navbar";
import { OrbitLogo } from "./components/orbit-logo";
import { Sidebar } from "./components/sidebar";
import { UserNav } from "./components/user-nav";
import { LayoutSidebar } from "@/components/layout-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <LayoutSidebar>
      <main className='flex-1 p-5 overflow-y-auto'>{children}</main>
    </LayoutSidebar>
  );
}
