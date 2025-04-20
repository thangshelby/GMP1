import http from "./http";

export const getScreener = async (date: string, page: number) => {
  const response = await http.get(`screener`, {
    params: {
      date,
      page,
    },
  });
  return response.data;
};
