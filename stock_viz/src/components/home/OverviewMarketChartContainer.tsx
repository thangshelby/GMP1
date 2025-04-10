"use client";

import React from "react";
import { fetchAPI } from "@/lib/utils";
import { StockPriceDataType } from "@/types";
import OverviewMarketChart from "./OverviewMarketChart";

const OverviewMarketChartContainer = () => {
  const [hoseMarketData, setHoseMarketData] = React.useState<
    StockPriceDataType[]
  >([]);
  const [hnxMarketData, setHnxMarketData] = React.useState<
    StockPriceDataType[]
  >([]);
  const [upcomMarketData, setUpcomMarketData] = React.useState<
    StockPriceDataType[]
  >([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetchAPI(
          `/market/market_overview?date=2024-04-11`,
        );
        const hoseData = response.hnx_market;
        const hnxData = response.hose_market;
        const upcomData = response.upcom_market;

        setHoseMarketData(hoseData);
        setHnxMarketData(hnxData);
        setUpcomMarketData(upcomData);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading data</div>;
  }
  return (
    <div className="flex w-full flex-row justify-between gap-x-4 p-4 px-12">
      <OverviewMarketChart
        data={hoseMarketData}
        chartName="HOSE"
      />
      <OverviewMarketChart
        data={hnxMarketData}
        chartName="HNX"
      />
      <OverviewMarketChart
        data={upcomMarketData}
        chartName="UPCOM"
      />
    </div>
  );
};

export default OverviewMarketChartContainer;
