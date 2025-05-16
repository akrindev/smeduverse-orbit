import { LayoutSidebar } from "@/components/layout-sidebar";
import { validateAuthSession } from "@/lib/auth-actions";
import { cache } from "react";
import AuthGuardClient from "./components/auth-guard-client";

// Cache the auth validation to prevent repeated API calls
const getAuthSession = cache(async () => {
  return await validateAuthSession();
});

// Server component that checks for authentication
export default async function DashboardLayout({ children }) {
  // Validate authentication session on the server with caching
  // This is now mainly to prevent SSR errors - real auth checks happen client-side
  await getAuthSession();

  return (
    <AuthGuardClient>
      <LayoutSidebar>
        <main className="flex-1 p-5 overflow-y-auto">{children}</main>
      </LayoutSidebar>
    </AuthGuardClient>
  );
}
