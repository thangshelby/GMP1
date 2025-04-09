"use client";
import { useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/utils";
import { useState, useEffect } from "react";
import { StockOverviewInformationType } from "@/types";

export default function StockChartOverview() {
  const symbol = useSearchParams().get("symbol");

  const [stockOverviewInfor, setStockOverviewInfor] =
    useState<StockOverviewInformationType>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `stocks/stock_overview_information?symbol=${symbol}`,
      );

      setStockOverviewInfor(response[0]);
    };
    fetchData();
  }, [symbol]);

  return (
    <div className="flex flex-row items-center justify-between bg-[#181b22] px-[2rem] py-[1rem]">
      {/* HEADER 1 */}
      <div className="flex flex-col">
        <div className="flex flex-row items-end gap-x-[0.8rem]">
          <h1 className="text-secondary text-3xl leading-[1.2] font-bold">
            {symbol?.toLocaleUpperCase()}
          </h1>
          <p className="text-primary text-xl font-semibold">
            {stockOverviewInfor?.short_name}s
          </p>
        </div>
        <div className="flex flex-row items-center gap-x-[0.6rem]">
          <p className="text-primary text-xs font-semibold">
            {stockOverviewInfor?.exchange}
          </p>
          <p className="text-primary text-xs font-semibold">
            {stockOverviewInfor?.company_type}
          </p>
          <p className="text-primary text-xs font-semibold">
            {stockOverviewInfor?.industry}
          </p>

          <p className="text-primary text-xs font-semibold">VND</p>
        </div>
      </div>
    </div>
  );
}
