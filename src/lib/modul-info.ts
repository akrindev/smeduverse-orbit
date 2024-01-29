import { api } from "./api";

export const getModulInfo = async (uuid: string) => {
  const response = await api.get(`/modul/show/${uuid}`).catch((e) => {
    // if not found
    if (e.response.status === 404) {
      return {
        notFound: true,
      };
    }
    return e.response;
  });

  return response;
};
