import { LayoutSidebar } from "@/components/layout-sidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateAuthSession } from "@/lib/auth-actions";

// Server component that checks for authentication
export default async function DashboardLayout({ children }) {
  // Validate authentication session on the server
  const { isAuthenticated, user } = await validateAuthSession();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Get the current path to redirect back after login
    const currentPath = "/dashboard"; // Default fallback
    return redirect(`/login?from=${encodeURIComponent(currentPath)}`);
  }

  return (
    <LayoutSidebar>
      <main className="flex-1 p-5 overflow-y-auto">{children}</main>
    </LayoutSidebar>
  );
}
