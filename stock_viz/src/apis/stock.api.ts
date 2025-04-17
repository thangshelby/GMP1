import http from "./http";

export const getStockOverviewInformation = async (symbol: string,date:string) => {
  const response = await http.get(`stocks/stock_review`, {
    params: {
      symbol: symbol,
      date: date, 
    },
  });
  return response.data;
};
