import { LayoutSidebar } from "@/components/layout-sidebar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateAuthSession } from "@/lib/auth-actions";
import { cache } from "react";

// Cache the auth validation to prevent repeated API calls
const getAuthSession = cache(async () => {
  return await validateAuthSession();
});

// Server component that checks for authentication
export default async function DashboardLayout({ children }) {
  // Validate authentication session on the server with caching
  const { isAuthenticated, user } = await getAuthSession();

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
