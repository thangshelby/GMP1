"use client";
import React from "react";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getMarketIndicatorsOverview } from "@/apis/market.api";
const OverviewIndicatorMarket = () => {
  const date = format(subYears(new Date(), 1), "yyyy-MM-dd");

const result = useQuery({
  queryKey: ["market/market-indicators-overview", date],
  queryFn: () => getMarketIndicatorsOverview(date),
});

  if (result.isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between p-4">
      {Object.keys(result.data).map((categoryKey) => {
        return renderOverview(categoryKey, result.data[categoryKey]);
      })}
    </div>
  );
};

export default OverviewIndicatorMarket;
interface MarketIndicatorsOverviewType {
  [key: string]: number;
}
const renderOverview = (name: string, data: MarketIndicatorsOverviewType) => {
  const key1 = Object.keys(data)[0];
  const key2 = Object.keys(data)[1];
  const greenPercent = (data[key1] / (data[key1] + data[key2])) * 100;
  const redPercent = (data[key2] / (data[key1] + data[key2])) * 100;  

  return (
    <div
      key={name}
      className="border-secondary-2 flex w-[22%] flex-col items-center justify-center gap-1 rounded-md border-[1px] p-2"
    >
      <div className="flex w-full flex-row items-start justify-between">
        <div className={`text-green text-2xs text-start font-semibold`}>
          <p>{key1.split('_').join(' ')}</p>
          <p>
            {greenPercent.toFixed(2)}% ({data[key1]})
          </p>
        </div>
        <p className="text-secondary-3 text-2xs font-thin">
          {name.split("_").join(" ")}
        </p>

        <div className={`text-red text-2xs text-end font-semibold`}>
          <p>{key2.split('_').join(' ')}</p>
          <p>
            {redPercent.toFixed(2)}% ({data[key2]})
          </p>
        </div>
      </div>

      <div className="flex w-full flex-row justify-between overflow-hidden rounded-2xl">
        <div
          style={{ width: `${greenPercent}%` }}
          className={`bg-green h-[6px]`}
        ></div>
        <div
          style={{ width: `${redPercent}%` }}
          className={`bg-red h-[6px]`}
        ></div>
      </div>
    </div>
  );
};
