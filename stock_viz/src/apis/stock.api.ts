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
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getStockQuote = async (
  symbol: string,
  start_date: string,
  end_date: string,
  interval: string,
) => {
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
  const response = await http.post(
    `stocks/stocks_quote`,
    {
      symbols: symbols,
      date: date,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
};

export const getAllStockSymbols = async () => {
  const response = await http.get(`stocks/all_stock_symbols`);
  return response.data;
};

export const getIndicatorSMA = async (
  symbol: string,
  window: number,
  date: string,
) => {
  const response = await http.get(`stocks/indicators/sma`, {
    params: {
      symbol,
      window,
      date,
    },
  });
  return response.data;
};

export const getIndicatorRSI = async (
  symbol: string,
  window: number,
  date: string,
) => {
  const response = await http.get(`stocks/indicators/rsi`, {
    params: { symbol, window, date },
  });
  return response.data;
};

export const getIndicatorMACD = async (
  symbol: string,
  fastPeriod: number,
  slowPeriod: number,
  signalPeriod: number,
  date: string,
) => {
  const response = await http.get(`stocks/indicators/macd`, {
    params: { symbol, fastPeriod, slowPeriod, signalPeriod, date },
  });
  return response.data;
};

export const getIndicatorBB = async (
  symbol: string,
  window: number,
  stdDev: number,
  date: string,
) => {
  const response = await http.get(`stocks/indicators/bb`, {
    params: { symbol, window, stdDev, date },
  });
  return response.data;
};

export const getIndicatorMFI = async (
  symbol: string,
  period: number,
  date: string,
) => {
  const response = await http.get(`stocks/indicators/mfi`, {
    params: { symbol, period, date },
  });
  return response.data;
};
