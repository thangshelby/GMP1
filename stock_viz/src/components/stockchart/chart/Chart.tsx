"use client";
import React, { useEffect, useRef } from "react";
import { StockPriceDataType } from "@/types";
import { HashLoader } from "react-spinners";
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  SeriesType,
} from "lightweight-charts";
import { BandsIndicator } from "@/plugins/bands-indicator";
import {
  mainChartContainerOptions,
  candleStickChartOptions,
  lineChartOptions,
  areaChartOptions,
} from "@/constants/chartConfig";
import { format, subYears } from "date-fns";
import { useChartControlStore, usePdfStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { BollingerBands } from "technicalindicators";
import { getStockQuote } from "@/apis/stock.api";
import { useQuery } from "@tanstack/react-query";
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
  }, [stockData, setCurrentStockPriceData, setClosePrice]);

  //HANDLE CHART TYPE CHANGE
  useEffect(() => {
    if (stockData.length == 0 || chart == null) return;

    if (currentChartRef.current != null) {
      try {
        chart.removeSeries(currentChartRef.current);
      } catch (error) {
        console.log("error", error);
      }
    }
    switch (selectedChart) {
      case 0:
        const candleSeries = chart.addSeries(
          CandlestickSeries,
          candleStickChartOptions,
        );
        candleSeries.setData(
          stockData.map((d) => ({
            time: format(new Date(d.time), "yyyy-MM-dd") || "",
            open: d.open,
            close: d.close,
            high: d.high,
            low: d.low,
          })),
        );
        currentChartRef.current = candleSeries;
        break;
      case 1:
        const lineSeries = chart.addSeries(LineSeries, {
          ...lineChartOptions,
          lineWidth: 1 as const,
        });
        lineSeries.setData(
          stockData.map((d) => ({
            time: format(new Date(d.time), "yyyy-MM-dd") || "",
            value: d.low,
          })),
        );
        currentChartRef.current = lineSeries;
        break;
      case 2:
        const areaSeries = chart.addSeries(AreaSeries, areaChartOptions);
        areaSeries.setData(
          stockData.map((d) => ({
            time: format(new Date(d.time), "yyyy-MM-dd") || "",
            value: d.close,
          })),
        );
        currentChartRef.current = areaSeries;
        break;
      default:
        break;
    }
  }, [
    selectedChart,
    stockData,
    setCurrentStockPriceData,
    setClosePrice,
    chart,
  ]);

  // //HANDLE INDICATOR CHANGE
  useEffect(() => {
    if (!chart) return;
    // if (
    //   selectedIndicators.includes("bb") &&
    //   ("bb" in indicatorRefSeries == false ||
    //     indicatorRefSeries["bb"] == undefined)
    // ) {
    //   const bb20 = BollingerBands.calculate({
    //     period: 20,
    //     values: stockData.map((d) => d.close),
    //     stdDev: 2,
    //   });

    //   const boilingerBandSeries = chart.addSeries(LineSeries, {
    //     lineWidth: 1,
    //     color: "#2196F3",
    //   });
      
    //   boilingerBandSeries.setData(
    //     bb20.map((d, i) => ({
    //       time: stockData[i + 19].time || "",
    //       value: d.middle,
    //     })).slice(0, bb20.length)
    //   );
    //   const bandIndicator = new BandsIndicator();
    //   boilingerBandSeries.attachPrimitive(bandIndicator);
    //   setIndicatorRefSeries((prev) => ({ ...prev, bb: boilingerBandSeries }));
    // } else if ("bb" in indicatorRefSeries && indicatorRefSeries["bb"]) {
    //   console.log("remove bb", indicatorRefSeries);
    //   const boilingerBandSeries = indicatorRefSeries["bb"];

    //   chart.removeSeries(boilingerBandSeries);
    //   setIndicatorRefSeries((prev) => ({ ...prev, bb: undefined }));
    // }

    if (
      selectedIndicators.includes("volume") &&
      ("volume" in indicatorRefSeries == false || !indicatorRefSeries["volume"])
    ) {
      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: "#26a69a",
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "", // set as an overlay by setting a blank priceScaleId
      });
      volumeSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.7, // highest point of the series will be 70% away from the top
          bottom: 0,
        },
      });
      volumeSeries.setData(
        stockData.map((d) => ({
          time: d.date || d.time || "",
          value: d.volume || 0,
          color: d.open > d.close ? "#813539" : "#1c5e5e",
        })),
      );
      setIndicatorRefSeries((prev) => ({ ...prev, volume: volumeSeries }));
    } else if ("volume" in indicatorRefSeries && indicatorRefSeries["volume"]) {
      const volumeSeries = indicatorRefSeries["volume"];
      chart.removeSeries(volumeSeries);
      setIndicatorRefSeries((prev) => ({ ...prev, volume: undefined }));
    }
  }, [selectedIndicators, stockData, chart]);

  if (result.isLoading) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center">
        <HashLoader color="#2196F3" size={150} />
      </div>
    );
  }
  return (
    <div
      className="h-full w-full"
      id="chartContainer"
      ref={chartContainerRef}
    />
  );
};

export default Chart;
