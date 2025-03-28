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

export interface StockPriceDataType{
  close: number;
  time?: string;
  date?: string;
  high: number;
  low: number;
  open: number;
  volume?: number;
  }
