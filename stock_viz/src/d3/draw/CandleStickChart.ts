import * as d3 from "d3";
import { StockPriceDataType } from "@/types/index";
import { height } from "@/constants/index";

export const createCandlestickChart = (
  x: any,
  y: any,
  parsedData: StockPriceDataType[],
  candleWidth: number,
) => {
  const chartArea = d3.select(".chart-area");
  // Volume bars
  let newDomain = [
    d3.min(parsedData, (d) => d.volume) ?? 0,
    d3.max(parsedData, (d) => d.volume ?? 0),
  ] as [number, number];

  let per = 1;
  let theds = newDomain[1];
  while (theds > 100) {
    theds = theds / 10;
    per = per * 10;
  }

  per /= 2;

  // Candle
  chartArea
    .selectAll(".candle")
    .data(parsedData)
    .enter()
    .append("rect")
    .attr("class", "candle")
    .attr("x", (d: StockPriceDataType) => {
      return x(d.date);
    })
    .attr("y", (d: StockPriceDataType) => y(Math.max(d.open, d.close)))
    .attr("width", candleWidth)
    .attr("height", (d: StockPriceDataType) => {
      const height =
        y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close));

      return height;
    })
    .attr("fill", (d: StockPriceDataType) =>
      d.open < d.close ? "#30cc5a" : "#f63538",
    );

  // Wicks
  chartArea
    .selectAll(".wick")
    .data(parsedData)
    .enter()
    .append("line")
    .attr("class", "wick")
    .attr("x1", (d: StockPriceDataType) => x(d.date) + candleWidth / 2)
    .attr("x2", (d: StockPriceDataType) => x(d.date) + candleWidth / 2)
    .attr("y1", (d: StockPriceDataType) => y(d.high))
    .attr("y2", (d: StockPriceDataType) => y(d.low))
    .attr("stroke", (d: StockPriceDataType) =>
      d.open < d.close ? "#30cc5a" : "#f63538",
    )
    .attr("stroke-width", 1);

  chartArea
    .selectAll(".barVolume")
    .data(parsedData)
    .enter()
    .append("rect")
    .attr("class", "barVolume")
    .attr("x", (d: StockPriceDataType) => {
      return x(d.date);
    })
    .attr("y", (d: StockPriceDataType) => height - 50 - d.volume / per)
    .attr("width", candleWidth) // Candle width
    .attr("height", (d: StockPriceDataType) => d.volume / per)

    .attr("fill", (d: StockPriceDataType) =>
      d.open < d.close ? "#7fbf7f" : "#ff7f7f  ",
    );

  // chartArea
  const zoom = d3.zoom()
  .scaleExtent([0.5, 32])
  .on("zoom", zoomed);

function zoomed({ transform }: { transform: d3.ZoomTransform }) {
  console.log("zooming...");
  
  const xAxis = d3.select(".x-axis");
  const newX = transform.rescaleX(x);

  const yAxis = d3.select(".y-axis");
  const newY = transform.rescaleY(y);

  xAxis.call(d3.axisBottom(newX));
  yAxis.call(d3.axisLeft(newY));
}

// Áp dụng zoom vào vùng vẽ biểu đồ
chartArea.call(zoom);

};

export const deleteCandlestickChart = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.selectAll(".candle").remove();
  chartArea.selectAll(".wick").remove();
  // chartArea.selectAll(".barVolume").remove();
};
