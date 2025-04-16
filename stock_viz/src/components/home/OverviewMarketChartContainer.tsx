"use client";

import React from "react";
import OverviewMarketChart from "./OverviewMarketChart";
import { useQuery } from "@tanstack/react-query";
import { getMarketOverview } from "@/apis/market.api";
import { Skeleton } from "@/components/ui/skeleton";

const OverviewMarketChartContainer = () => {
  const result = useQuery({
    queryKey: ["market_overview"],
    queryFn: () => getMarketOverview("2024-09-04"),
    refetchOnWindowFocus: false,
  });

  if(result.isSuccess){
    console.log(result.data)
  }

  if (result.isSuccess) {
    return (
      <div className="flex w-full flex-row justify-between gap-x-4 p-4 px-12">
        <OverviewMarketChart
          data={result.data.hose_market}
          chartName="HOSE"
          closePrice={result.data.hose_close}
        />
        <OverviewMarketChart
          data={result.data.hnx_market}
          chartName="HNX"
          closePrice={result.data.hnx_close}
        />
        <OverviewMarketChart
          data={result.data.upcom_market}
          chartName="UPCOM"
          closePrice={result.data.upcom_close}
        />
      </div>
    );
  }
  if (result.isLoading) {
    return (
      <div className="flex w-full flex-row justify-between gap-x-4 p-4 px-12">
        <div className="border-secondary-3 flex w-full flex-col rounded-lg border-[1px] p-2">
          <Skeleton className="h-56 w-full rounded-xs" />
        </div>
        <div className="border-secondary-3 flex w-full flex-col rounded-lg border-[1px] p-2">
          <Skeleton className="h-56 w-full rounded-xs" />
        </div>
        <div className="border-secondary-3 flex w-full flex-col rounded-lg border-[1px] p-2">
          <Skeleton className="h-56 w-full rounded-xs" />
        </div>
      </div>
    );
  }
};

export default OverviewMarketChartContainer;
