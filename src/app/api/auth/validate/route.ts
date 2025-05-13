import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// This route can be used by client components to check if the user is authenticated
export async function GET(request: NextRequest) {
  // Get the session from NextAuth
  const session = await getServerSession(authOptions);

  // If no session, return unauthorized
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Return authenticated status
  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      roles: session.user.roles,
    },
  });
}
