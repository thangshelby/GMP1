export interface ReviewStockType {
  symbol: string;
  last: number;
  change: number;
  volume: number;
  signal: string;
  industry: string;
  market_cap: number;
}

export interface StockOverviewInformationType {
  company_type: string;
  delta_in_month: number;
  delta_in_week: number;
  delta_in_year: number;
  established_year: string;
  exchange: string;
  foreign_percent: number;
  industry: string;
  industry_id: number;
  industry_id_v2: string;
  issue_share: number;
  no_employees: number;
  no_shareholders: number;
  outstanding_share: number;
  short_name: string;
  stock_rating: number;
  website: string;
}

export interface StockPriceDataType {
  close: number;
  time?: string;
  date?: string;
  high: number;
  low: number;
  open: number;
  volume?: number;
}
export interface StockInfomationType {
  Activity: string;
  Category: string;
  Currency: string;
  Exchange: string;
  "Full Name": string;
  "Hist .": number;
  Market: string;
  Name: string;
  RIC: string;
  Sector: string;
  "Start Date": string;
  Symbol: string;
}


export interface BusinessDataType {
  analyst_outlook: {
      buy: number;
      hold: number;
      sell: number;
      suggest:string
  };
  company_detail: {
    short_name: string;
    website: string;
  };
  date: string; // ISO Date format (YYYY-MM-DD)
  general_info: {
    exchange: string;
    industry: string;
    noe: number;
    stock_rate: number;
  };
  percentage_change: {
    "1_day": number;
    "5_day": number;
    month_to_date: number;
    "3_months": number;
    "6_months": number;
    year_to_date: number;
  };
  business_summary: string;
  financial_summary: string;
  ratio: {
    dividend_yield: number | null; // NaN in JSON is represented as null in TypeScript
    pe_ttm: number | null;
  };
  share_detail: {    
    "52_wk_high_high": number | 10;
    "52_wk_high_low": number;
    "5_day_avg_volume": number;
    "10_day_avg_volume": number;
    beta_value: number;
    Currency: "VND";
    shares_outstanding: number | null;
  };
  symbol: string;
}

export interface FinancialDataType {
  ai_analysis: AIAnalysis;
  balance_sheet: BalanceSheet;
  income_statement: IncomeStatement;
  profitability_analysis: ProfitabilityAnalysis;
}
interface AIAnalysis{
  'balance_sheet':string,
  'income_statement':string,
  'profitability_analysis':string
}
interface BalanceSheet {
  "Equity": number[];
  "Total Current Assets": number[];
  "Total liabilities and equity": number[];
  "Property/Plant/Equipment,Total - Net": number[];
  "Total Assets": number[];
  "Total Current Liabilities": number[];
  "Total Long-Term Debt": number[];
  "Total Liabilities": number[];
  [key: string]: number[];
}

interface IncomeStatement {
  "Net Income After Taxes": number[];
  "Net Income Before Extra.\nItems": number[];
  "Net Income Before Taxes": number[];
  "Operating Income": number[];
  "EPS": number[];
  "Minority Interest": number[];
  "Profit attributable to parent company shareholders": number[];
  Revenue: number[];
  "Total Operating Expense": number[];
  [key: string]: number[];
}

interface ProfitabilityAnalysis {
  ROE: number[];
  ROA: number[];
  "Income After Tax Margin (%)": number[];
  "Long Term Debt/Equity, %": number[];
  "Revenue/Tot Assets": number[];
  "Total Debt/Equity, %": number[];
  "Total Debt/Equity": number[];
 
  [key: string]: number[];
}
