import { api } from "./api";

export const getModulInfo = async (uuid: string) => {
  try {
    // Use axios api client which already has withCredentials set to true
    // Sanctum will automatically include the session cookie
    const response = await api.get(`/modul/show/${uuid}`);
    return response;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { status: 404, data: null };
    }
    throw error;
  }
};
