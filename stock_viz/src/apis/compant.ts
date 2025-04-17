import http from "./http";

export const getCompanyMetadata = async (symbol: string) => {
  const response = await http.get(`/company/company_metadata?symbol=${symbol}`);
  return response.data;
};



