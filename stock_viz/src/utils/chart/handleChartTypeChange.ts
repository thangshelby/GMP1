import { StockPriceDataType } from "@/types";
import { IChartApi, ISeriesApi, SeriesType } from "lightweight-charts";
import {
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BarSeries,
} from "lightweight-charts";
import { format } from "date-fns";
import {
  candleStickChartOptions,
  lineChartOptions,
  areaChartOptions,
  barChartOptions,
} from "@/constants/chartConfig";

export const handleChartTypeChange = (
  chart: IChartApi,
  stockData: StockPriceDataType[],
  currentChartRef: React.RefObject<ISeriesApi<SeriesType> | null>,
  selectedChart: number,
) => {
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
    case 3:
      const barSeries = chart.addSeries(BarSeries, {
        ...barChartOptions,
      });
      barSeries.setData(
        stockData.map((d) => ({
          time: format(new Date(d.time), "yyyy-MM-dd") || "",
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        })),
      );
      currentChartRef.current = barSeries;
      break;

    default:
      break;
  }
};
