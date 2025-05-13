import { redirect } from "next/navigation";
import Link from "next/link";
import { validateAuthSession } from "@/lib/auth-actions";

export default async function Page() {
  // Check authentication status
  const { isAuthenticated } = await validateAuthSession();

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect("/dashboard");
  }

  // If not authenticated, show login link
  return <Link href={`/login`}>Login</Link>;
}
