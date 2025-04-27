import http from "./http";

export const getSymbolReview = async (
  date: string,
  prepare_for: string,
  time_frame?: string,
) => {
  const response = await http.get(`market/symbols_review`, {
    params: {
      date,
      prepare_for,
      time_frame,
    },
  });
  return response.data;
};

export const getMarketOverview = async (date: string) => {
  const response = await http.get(`market/market_overview`, {
    params: {
      date: date,
    },
  });
  return response.data;
};


export const getMarketIndicatorsOverview = async (date: string) => {
  const response = await http.get(`market/market_indicators_overview`, {
    params: {
      date: date,
    },
  });
  return response.data;
};
