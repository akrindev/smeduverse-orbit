import { LayoutSidebar } from "@/components/layout-sidebar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Server component that checks for authentication
export default async function DashboardLayout({ children }) {
  // Get the session from NextAuth
  const session = await getServerSession(authOptions);

  // If no session (not authenticated), redirect to login
  if (!session) {
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
