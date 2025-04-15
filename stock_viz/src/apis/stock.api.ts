import http from "./http";

export const getStockOverviewInformation = async (symbol: string) => {
  const response = await http.get(`stocks/stock_overview_information`, {
    params: {
      symbol: symbol,
    },
  });
  return response.data;
};
