"use client";
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query";
import { getStockOverviewInformation } from "@/apis/stock.api";
import { subYears, format } from "date-fns";

export default function StockChartOverview() {
  const symbol = useSearchParams().get("symbol");
  const today = format(subYears(new Date(), 1), "yyyy-MM-dd");

  const result = useQuery({
    queryKey: ["stock_overview_information"],
    queryFn: () => getStockOverviewInformation(symbol!, today),
    refetchOnWindowFocus: false,
  });

  if (result.isSuccess) {
    return (
      <div className="flex flex-row items-center justify-between bg-[#181b22] px-[2rem] py-[1rem]">
        {/* HEADER 1 */}
        <div className="flex flex-col">
          <div className="flex flex-row items-end gap-x-[0.8rem]">
            <h1 className="text-secondary text-3xl leading-[1.2] font-bold">
              {symbol?.toLocaleUpperCase()}
            </h1>
            <p className="text-primary text-xl font-semibold">
              {result.data?.name}
            </p>
          </div>
          <div className="flex flex-row items-center gap-x-[0.6rem]">
            <p className="text-primary text-xs font-semibold">HOSE</p>
            <p className="text-primary text-xs font-semibold">
              {result.data?.industry}
            </p>
            <p className="text-primary text-xs font-semibold">
              {result.data?.industry}
            </p>

            <p className="text-primary text-xs font-semibold">VND</p>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <p className="text-secondary text-xs font-semibold">
            {new Date().toLocaleDateString()}
          </p>
          <div className="flex flex-row items-center gap-x-[0.6rem]">
            <p className="text-4xl font-semibold text-white">
              {result.data?.last}
            </p>
            <div className="flex flex-col items-center justify-center">
              <p
                className={`text-xs font-semibold ${result.data?.change > 0 ? "text-green-500" : "text-red-500"} `}
              >
                {result.data?.change}%
              </p>
              <p
                className={`text-xs font-semibold ${result.data?.change > 0 ? "text-green-500" : "text-red-500"} `}
              >
                {(result.data?.change * result.data?.last).toFixed(2)}{" "}
                {result.data?.change > 0 ? " ↑" : "↓"}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-x-[0.6rem]">
            {stockTabs.map((tab, index) => (
              <p key={index} className="text-primary text-xs font-bold">
                {tab}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const stockTabs = [
  "Stock Detail",
  "Compare Perf.",
  "Short Interest",
  "Financials",
  "Traffic",
  "Options",
  "Latest Filings",
  "Add to Portfolio",
  "Set Alert",
];
