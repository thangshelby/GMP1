import http from "./http";

export const getCompanyMetadata = async (symbol: string) => {
  const response = await http.get(`/company/company_metadata?symbol=${symbol}`);
  return response.data;
};

export const getCompanyNewsWichart = async (symbol: string) => {
  const response = await http.get(
    `/company/company_news_wichart?symbol=${symbol}`,
  );
  return response.data;
};
