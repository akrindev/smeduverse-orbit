import { getSession } from "next-auth/react";
import { api } from "./api";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export const getModulInfo = async (uuid: string, serverSession?: any) => {
  let session;

  if (typeof window !== "undefined") {
    // Client-side
    session = await getSession();
  } else {
    // Server-side
    session = await getServerSession(authOptions);
  }

  try {
    const response = await api.get(`/modul/show/${uuid}`, {
      headers: {
        Authorization: `Bearer ${session?.user?.access_token}`,
      },
    });
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { status: 404, data: null };
    }
    throw error;
  }
};
