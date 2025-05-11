import http from "@/apis/http";
import { FinancialDataType } from "@/types";
import { BusinessDataType } from "@/types";

export const getBusinessReport = async (symbol: string, start_date: string, end_date: string) => {
  const response = await http.get(`/reports/business?symbol=${symbol}&start_date=${start_date}&end_date=${end_date}`);
  return response.data;
};

export const getBubbleChartData= async (symbol: string) => {
  const response = await http.get(`/reports/financial/chart/bar_and_line?symbol=${symbol}`);
  return response.data;
};

export const getLineChartData = async (symbol: string, start_date: string, end_date: string, interval: string) => {
  const response = await http.get(`/reports/financial/chart/line?symbol=${symbol}&start_date=${start_date}&end_date=${end_date}&interval=${interval}`);
  return response.data;
};



export const getFinancialChartAssetEquity = async (symbol: string) => {
  const response = await http.get(`/reports/financial/chart/asset_equity?symbol=${symbol}`);
  return response.data;
};


export const getFinancialSummary = async (symbol: string) => {
  const response = await http.get(`/reports/financial?symbol=${symbol}`);
  return response.data;
};

export const getFinalAnalysis= async (symbol: string, financialData: FinancialDataType, businessData: BusinessDataType) => {
  const response = await http.post(`/reports/financial/final_analysis?symbol=${symbol}`, { financialData, businessData });
  return response.data;
};

export const getFinancialReport = async (symbol: string, period: string) => {
  const response = await http.get(`/reports/financial_report?symbol=${symbol}&period=${period}`);
  return response.data;
};
