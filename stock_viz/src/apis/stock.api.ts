import http from "./http";

export const getStockOverviewInformation = async (
  symbol: string,
  date: string,
) => {
  const response = await http.get(`stocks/stock_review`, {
    params: {
      symbol: symbol,
      date: date,
    },
  });
  return response.data;
};

export const getStockQuote = async (symbol: string, start_date: string,end_date:string,interval:string) => {
  const response = await http.get(`stocks/stock_quote`, {
    params: {
      symbol,
      start_date,
      end_date,
      interval,
    },
  });
  return response.data;
};

export const getStocksQuote = async (symbols: string, date: string) => {
  const response = await http.get(`stocks/stocks_quote`, {
    params: {
      symbols: symbols,
      date: date,
    },
  });
  return response.data;
};

export const getAllStockSymbols= async ()=>{
  const response = await http.get(`stocks/all_stock_symbols`)
  return response.data
}