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
    recommendation: string; // Đã sửa tên từ "recomendation" thành "recommendation"
  };
  company_detail: {
    address: string;
    phone_number: string;
    company_short_name: string;
    website: string;
  };
  general_information: { // Đã sửa từ "infomation" thành "information"
    ISSN_code: string;
    issue_share: number;
    exchange_code: string;
    industry: string;
    number_of_employees: number; // Đã sửa tên từ 'no._of_employees'
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
    "52_wk_high_high": number; // Sửa từ "number | 10" thành "number" vì 10 không phải kiểu
    "52_wk_high_low": number;
    "5_day_avg_volume": number;
    "10_day_avg_volume": number;
    beta_value: number;
    currency: "VND"; // Đổi từ "Currency" thành "currency" theo quy tắc camelCase
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

export interface CompanyNewsTypeSourceVCI{
  ceiling: number;               // Giá trần
  close_price: number;          // Giá đóng cửa
  created_at: string | null;
  floor: number;                // Giá sàn
  friendly_sub_title: string;
  id: string;
  lang_code: string;
  news_full_content: string;
  news_id: string;
  news_image_url: string;
  news_short_content: string;
  news_source_link: string;
  news_sub_title: string;
  news_title: string;
  price_change_pct: number;     // % thay đổi giá
  public_date: number;          // timestamp (ms)
  ref_price: number;            // Giá tham chiếu
  updated_at: string | null;
}

export interface CompanyNewsTypeSourceTCBS {
  id: number;
  price: number;
  price_change: number;
  price_change_ratio: number;
  price_change_ratio_1m: number;
  publish_date: string; // hoặc Date nếu bạn xử lý ngày dưới dạng object
  rs: number;
  rsi: number;
  source: string;
  title: string;
}

export interface CompanySubsidiaryType {
  // id:number;
  // organ_name:string;
  // type:string;
  // ownership_percent:number;
  // sub_organ_code:string;
  sub_company_name:string,
  sub_own_percent:number,
}