"use client";
import React, { useEffect, useRef } from "react";
import { StockPriceDataType } from "@/types";
import { HashLoader } from "react-spinners";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  SeriesType,
} from "lightweight-charts";
import { format, subYears } from "date-fns";
import { useChartControlStore, usePdfStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { getStockQuote } from "@/apis/stock.api";
import { useQuery } from "@tanstack/react-query";
import { handleChartTypeChange } from "@/utils/chart/handleChartTypeChange";
import { handleChartIndicatorsChange } from "@/utils/chart/handleChartIndicatorsChange";
import { mainChartContainerOptions } from "@/constants/chartConfig";
const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { setClosePrice } = usePdfStore();
  const [chart, setChart] = React.useState<IChartApi | null>(null);
  const end_date = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const currentChartRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const [indicatorRefSeries, setIndicatorRefSeries] = React.useState<
    Record<string, ISeriesApi<SeriesType> | undefined>
  >({});

  const {
    selectedChart,
    selectedIndicators,
    setCurrentStockPriceData,
    interval,
  } = useChartControlStore();
  const [stockData, setStockData] = React.useState<StockPriceDataType[]>([]);
  const symbol = useSearchParams().get("symbol") || "VCB";
  const result = useQuery({
    queryKey: ["stocks/stock-quote", symbol, interval],
    queryFn: () => getStockQuote(symbol, "2000-01-01", end_date, interval),
  });
  //HANDLE FETCHDATA
  useEffect(() => {
    if (!result.isSuccess) return;

    setStockData(result.data);
    setCurrentStockPriceData(result.data[result.data.length - 1]);
    setClosePrice(result.data[result.data.length - 1].close);
  }, [
    symbol,
    interval,
    setCurrentStockPriceData,
    setClosePrice,
    result.data,
    result.isSuccess,
  ]);

  //HANDLE CREATE MAIN CHART
  useEffect(() => {
    if (!chartContainerRef.current || stockData.length == 0) return;

    const chart = createChart(chartContainerRef.current!, {
      ...mainChartContainerOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    setChart(chart);

    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData) return;

      for (const [, value] of param.seriesData.entries()) {
        if (
          "open" in value &&
          "high" in value &&
          "low" in value &&
          "close" in value
        ) {
          setCurrentStockPriceData({
            time: String(value.time),
            open: value.open,
            high: value.high,
            low: value.low,
            close: value.close,
          });
        }
      }
    });

    return () => {
      chart.remove();
    };
  }, [stockData, setCurrentStockPriceData, setClosePrice, result.isSuccess]);

  //HANDLE CHART TYPE CHANGE
  useEffect(() => {
    if (stockData.length == 0 || chart == null || !result.isSuccess) return;

    handleChartTypeChange(chart, stockData, currentChartRef, selectedChart);
  }, [
    selectedChart,
    stockData,
    setCurrentStockPriceData,
    setClosePrice,
    chart,
    result.isSuccess,
  ]);

  // //HANDLE INDICATOR CHANGE
  useEffect(() => {
    if (!chart || result.isLoading) return;

    handleChartIndicatorsChange(
      chart,
      stockData,
      currentChartRef,
      selectedIndicators,
      indicatorRefSeries,
      setIndicatorRefSeries,
    );
  }, [
    selectedIndicators,
    stockData,
    chart,
    result.isLoading,
    indicatorRefSeries,
  ]);
  return (
    <div
      style={{ display: result.isLoading ? "block" : "block" }}
      className="h-[450px] w-full xl:h-[500px] 2xl:h-[550px]"
      id="chartContainer"
      ref={chartContainerRef}
    >
      {result.isLoading && (
        <div className="flex h-full w-full items-center justify-center">
          <HashLoader color="#2196F3" size={150} />
        </div>
      )}
    </div>
  );
};

export default Chart;
