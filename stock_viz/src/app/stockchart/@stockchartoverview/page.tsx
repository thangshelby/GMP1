"use client";
import { useSearchParams } from "next/navigation";

import { StockOverviewInformationType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {getStockOverviewInformation} from "@/apis/stock.api";

export default function StockChartOverview() {
  const symbol = useSearchParams().get("symbol");


  const result= useQuery({
    queryKey: ["stocks/stock_overview_information"],
    queryFn: () => getStockOverviewInformation(symbol!),
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex flex-row items-center justify-between bg-[#181b22] px-[2rem] py-[1rem]">
      {/* HEADER 1 */}
      <div className="flex flex-col">
        <div className="flex flex-row items-end gap-x-[0.8rem]">
          <h1 className="text-secondary text-3xl leading-[1.2] font-bold">
            {symbol?.toLocaleUpperCase()}
          </h1>
          <p className="text-primary text-xl font-semibold">
            {result.data?.short_name}s
          </p>
        </div>
        <div className="flex flex-row items-center gap-x-[0.6rem]">
          <p className="text-primary text-xs font-semibold">
            {result.data?.exchange}
          </p>
          <p className="text-primary text-xs font-semibold">
            {result.data?.company_type}
          </p>
          <p className="text-primary text-xs font-semibold">
            {result.data?.industry}
          </p>

          <p className="text-primary text-xs font-semibold">VND</p>
        </div>
      </div>
    </div>
  );
}
