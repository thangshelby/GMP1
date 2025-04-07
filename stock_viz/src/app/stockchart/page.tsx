"use client";


import FinancialReport from "@/components/stockchart/FinancialReport/FinancialReport";

export default function StockChart() {
  return (
    <div className="flex flex-col w-full items-center justify-center p-4 bg-[#22262f] py-12">
      <FinancialReport />
    </div>
  );
}
