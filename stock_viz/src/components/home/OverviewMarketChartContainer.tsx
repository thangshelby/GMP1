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

  const [marketClosePrice, setMarketClosePrice] = React.useState<{
    hose: number;
    hnx: number;
    upcom: number;
  }>({
    hose: 0,
    hnx: 0,
    upcom: 0,
  });
  

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetchAPI(
          `/market/market_overview?date=2024-09-04`,
        );
        const hoseData = response.hose_market;
        const hnxData = response.hnx_market;
        const upcomData = response.upcom_market;

        setHoseMarketData(hoseData);
        setHnxMarketData(hnxData);
        setUpcomMarketData(upcomData);
        setMarketClosePrice({
          hose: response.hose_close,
          hnx: response.hnx_close,
          upcom: response.upcom_close,
        });
      } catch (error) {
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
        closePrice={marketClosePrice.hose}
      />
      <OverviewMarketChart
        data={hnxMarketData}
        chartName="HNX"
        closePrice={marketClosePrice.hnx}
      />
      <OverviewMarketChart
        data={upcomMarketData}
        chartName="UPCOM"
        closePrice={marketClosePrice.upcom}
      />
    </div>
  );
};

export default OverviewMarketChartContainer;
