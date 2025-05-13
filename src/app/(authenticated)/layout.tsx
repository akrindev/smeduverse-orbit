import { LayoutSidebar } from "@/components/layout-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <LayoutSidebar>
      <main className='flex-1 p-5 overflow-y-auto'>{children}</main>
    </LayoutSidebar>
  );
}
