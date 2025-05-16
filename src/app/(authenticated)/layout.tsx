import { LayoutSidebar } from "@/components/layout-sidebar";
import { redirect } from "next/navigation";
import { cache } from "react";
import { validateAuthSession } from "@/lib/auth-actions";

// Cache the auth validation to prevent repeated API calls
const getAuthSession = cache(async () => {
  return await validateAuthSession();
});

// Server component that checks for authentication
export default async function DashboardLayout({ children }) {
  // Validate authentication session on the server with caching
  // This is now mainly to prevent SSR errors - real auth checks happen client-side
  await getAuthSession();

  // We no longer redirect here to prevent infinite loops
  // All authentication protection is handled by client components

  return (
    <LayoutSidebar>
      <main className="flex-1 p-5 overflow-y-auto">{children}</main>
    </LayoutSidebar>
  );
}
