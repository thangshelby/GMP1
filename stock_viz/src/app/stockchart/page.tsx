"use client";

import FinancialReport from "@/components/stockchart/FinancialReport/FinancialReport";
import CompanyNews from "@/components/stockchart/CompanyNews";

export default function StockChart() {
  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-[#22262f] py-12 gap-8">
      
      <CompanyNews />
      <FinancialReport />

    </div>
  );
}
