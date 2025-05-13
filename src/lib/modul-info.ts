import { api } from "./api";

export const getModulInfo = async (uuid: string) => {
  try {
    // Use axios api client which automatically adds the auth token header
    const response = await api.get(`/modul/show/${uuid}`);
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { status: 404, data: null };
    }
    throw error;
  }
};
