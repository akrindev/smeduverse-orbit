import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

/**
 * API route to return the user session if authenticated.
 *
 * If the request is not authenticated, return a 401 status code without any response body.
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (session) {
    return new Response(JSON.stringify(session.user?.access_token), {
      status: 200,
    });
  } else {
    return new Response(null, {
      status: 401,
    });
  }
}
