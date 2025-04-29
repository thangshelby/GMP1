import { StockPriceDataType } from "@/types";

import { IChartApi, ISeriesApi, SeriesType } from "lightweight-charts";
import { BollingerBands } from "technicalindicators";
import { LineSeries, HistogramSeries } from "lightweight-charts";
import { BandsIndicator } from "@/plugins/bands-indicator";

export const handleChartIndicatorsChange = async (
  chart: IChartApi,
  stockData: StockPriceDataType[],
  currentChartRef: React.RefObject<ISeriesApi<SeriesType> | null>,
  selectedIndicators: string[],
  indicatorRefSeries: Record<string, ISeriesApi<SeriesType> | undefined>,
  setIndicatorRefSeries: React.Dispatch<
    React.SetStateAction<Record<string, ISeriesApi<SeriesType> | undefined>>
  >,
) => {
  //BB
  if (
    selectedIndicators.includes("bb") &&
    ("bb" in indicatorRefSeries == false ||
      indicatorRefSeries["bb"] == undefined)
  ) {
    try {
      const bb20 = BollingerBands.calculate({
        period: 20,
        values: stockData.map((d) => d.close),
        stdDev: 2,
      });

      const boilingerBandSeries = chart.addSeries(LineSeries, {
        lineWidth: 1,
        color: "#2196F3",
      });

      boilingerBandSeries.setData(
        bb20
          .map((d, i) => ({
            time: stockData[i + 19].time || "",
            value: d.middle,
          }))
          .slice(0, bb20.length),
      );
      const bandIndicator = new BandsIndicator();
      boilingerBandSeries.attachPrimitive(bandIndicator);
      setIndicatorRefSeries((prev) => ({ ...prev, bb: boilingerBandSeries }));
    } catch (error) {
      console.log("error", error);
    }
  } else if (
    "bb" in indicatorRefSeries &&
    indicatorRefSeries["bb"] &&
    !selectedIndicators.includes("bb")
  ) {
    try {
      const boilingerBandSeries = indicatorRefSeries["bb"];

      chart.removeSeries(boilingerBandSeries);
      setIndicatorRefSeries((prev) => ({ ...prev, bb: undefined }));
    } catch (error) {
      console.log("error", error);
    }
  }

  //BB

  //VOLUME
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
  } else if (
    !selectedIndicators.includes("volume") &&
    "volume" in indicatorRefSeries &&
    indicatorRefSeries["volume"]
  ) {
    const volumeSeries = indicatorRefSeries["volume"];
    try {
      chart.removeSeries(volumeSeries);
    } catch (error) {
      console.log("error", error);
    }
    setIndicatorRefSeries((prev) => ({ ...prev, volume: undefined }));
  }
  //VOLUME


  
};
