"use client";
import React, { useEffect, useRef } from "react";
import { StockPriceDataType } from "@/types";
import { fetchAPI } from "@/lib/utils";
import { HashLoader } from "react-spinners";
import {
  createChart,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  BarSeries,
  HistogramSeries,
  BaselineSeries,
} from "lightweight-charts";
import { BandsIndicator } from "@/plugins/bands-indicator";
import {
  mainChartContainerOptions,
  candleStickChartOptions,
  lineChartOptions,
  areaChartOptions,
  barChartOptions,
  histogramChartOptions,
} from "@/constants/chartConfig";
import { format, subMonths } from "date-fns";
import { useChartControlStore } from "@/store";
import { useSearchParams } from "next/navigation";

import { SMA, BollingerBands } from "technicalindicators";

const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const [chart, setChart] = React.useState<any>(null);

  const currentChartRef = useRef<any>(null);

  const {
    selectedChart,
    selectedIndicators,
    setCurrentStockPriceData,
    interval,
  } = useChartControlStore();
  const [stockData, setStockData] = React.useState<StockPriceDataType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const symbol = useSearchParams().get("symbol");

  useEffect(() => {
    const fetchData = async () => {
      const end_date = format(subMonths(new Date(), 1), "yyyy-MM-dd");

      const data = await fetchAPI(
        `stocks/stock_quote?symbol=${symbol}&end_date=${end_date}&interval=${interval}`,
      );
      setCurrentStockPriceData(data[data.length - 1]);
      setStockData(data);
      setLoading(false);
    };
    fetchData();
  }, [symbol, interval]);

  useEffect(() => {
    if (!chartContainerRef.current || stockData.length == 0) return;

    const chart = createChart(chartContainerRef.current!, {
      ...mainChartContainerOptions,
      width: chartContainerRef.current.clientWidth,
    });

    setChart(chart);

    // Add series
    const candlestickSeries = chart.addSeries(
      CandlestickSeries,
      candleStickChartOptions,
    );

    currentChartRef.current = candlestickSeries;

    candlestickSeries.setData(
      stockData.map((d) => ({
        time: d.date || d.time || "",
        open: d.open,
        close: d.close,
        high: d.high,
        low: d.low,
      })),
    );
    chart.timeScale().fitContent();

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
  }, [stockData]);
  //HANDLE CHART TYPE CHANGE
  useEffect(() => {
    if (stockData.length == 0 || !chart) return;
    chart.removeSeries(currentChartRef.current);

    switch (selectedChart) {
      case 0:
        const candleSeries = chart.addSeries(
          CandlestickSeries,
          candleStickChartOptions,
        );
        candleSeries.setData(stockData);
        currentChartRef.current = candleSeries;
        break;
      case 1:
        const lineSeries = chart.addSeries(LineSeries, lineChartOptions);
        lineSeries.setData(
          stockData.map((d) => ({ time: d.time, value: d.low })),
        );
        currentChartRef.current = lineSeries;
        break;
      case 2:
        const areaSeries = chart.addSeries(AreaSeries, areaChartOptions);
        areaSeries.setData(
          stockData.map((d) => ({ time: d.time, value: d.close })),
        );
        currentChartRef.current = areaSeries;
        break;
      default:
        break;
    }
  }, [selectedChart, stockData]);

  //HANDLE INDICATOR CHANGE
  useEffect(() => {
    if (selectedIndicators.length == 0|| !chart) return;

    const bb20 = BollingerBands.calculate({
      period: 20,
      values: stockData.map((d) => d.close),
      stdDev: 2,
    });

    const middleLine = chart.addSeries(LineSeries, {
      lineWidth: 1,
      color: "#2196F3",
    });
    middleLine.setData(
      bb20.map((d, i) => ({
        time: stockData[i + 19].time || "",
        value: d.middle,
      })),
    );
    const bandIndicator = new BandsIndicator();
    middleLine.attachPrimitive(bandIndicator);
  }, [selectedIndicators, stockData]);

  if (loading) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center">
        <HashLoader color="#2196F3" size={100} />
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
