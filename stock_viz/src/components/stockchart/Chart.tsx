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
import { useChartControlStore, usePdfStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { SMA, BollingerBands } from "technicalindicators";

const Chart = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const { setClosePrice } = usePdfStore();
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

  //HANDLE FETCHDATA
  useEffect(() => {
    const fetchData = async () => {
      const end_date = format(subMonths(new Date(), 1), "yyyy-MM-dd");

      const data = await fetchAPI(
        `stocks/stock_quote?symbol=${symbol}&end_date=${end_date}&interval=${interval}`,
      );
      setCurrentStockPriceData(data[data.length - 1]);
      setStockData(data);
      setClosePrice(data[data.length - 1].close);
      setLoading(false);
    };
    fetchData();
  }, [symbol, interval]);

  //HANDLE CREATE MAIN CHART
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

    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // set as an overlay by setting a blank priceScaleId
      // set the positioning of the volume series
      scaleMargins: {
        top: 0.7, // highest point of the series will be 70% away from the top
        bottom: 0,
      },
    });
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.9, // highest point of the series will be 70% away from the top
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
    const lastBar = Date.now() / 1000; // Lấy timestamp hiện tại (đơn vị giây)
    const rangeDays = 90 * 24 * 60 * 60; // Lấy dữ liệu 90 ngày gần đây

    // chart.timeScale().setVisibleRange({
    //   from: Math.floor(new Date().getTime() / 1000),
    //   to: Math.floor(Math.abs(lastBar - rangeDays * 1000) / 1000),
    // });
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
    if (stockData.length == 0 || !chart || !currentChartRef.current) {
      console.log("I will run this time");
      return;
    }

    console.log(stockData.length,chart,currentChartRef.current);
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
  }, [selectedChart]);

  //HANDLE INDICATOR CHANGE
  useEffect(() => {
    if (selectedIndicators.length == 0 || !chart) return;

    if (selectedIndicators.includes("sma")) {
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
    }
  }, [selectedIndicators]);

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
