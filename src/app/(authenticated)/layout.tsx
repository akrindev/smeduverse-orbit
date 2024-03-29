import ThemeSwitcher from "@/components/theme-switcher";
import { BottomNavbar } from "./components/bottom-navbar";
import { OrbitLogo } from "./components/orbit-logo";
import { Sidebar } from "./components/sidebar";
import { UserNav } from "./components/user-nav";

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <OrbitLogo />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <ThemeSwitcher />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-6 min-h-screen">
          <Sidebar className="hidden lg:block" />
          <div className="pb-20 col-span-4 lg:col-span-5 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">{children}</div>
          </div>
        </div>
      </div>
      <BottomNavbar />
    </>
  );
}
