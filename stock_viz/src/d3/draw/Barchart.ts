import * as d3 from "d3";
import { StockPriceType } from "../../type";

export const createBarChart = (
  x: any,
  y: any,
  parsedData: StockPriceType[],
  barWidth: number,
) => {
  const chartArea = d3.select(".chart-area");
  chartArea
    .selectAll(".wick")
    .data(parsedData)
    .enter()
    .append("line")
    .attr("class", "wick")
    .attr("x1", (d: StockPriceType) => x(d.Date))
    .attr("x2", (d: StockPriceType) => x(d.Date))
    .attr("y1", (d: StockPriceType) => y(d.High))
    .attr("y2", (d: StockPriceType) => y(d.Low))
    .attr("stroke", (d: StockPriceType) =>
      d.Open < d.Close ? "#30cc5a" : "#f63538",
    )
    .attr("stroke-width", 1);
  chartArea
    .selectAll(".bar_line_close")
    .data(parsedData)
    .enter()
    .append("line")
    .attr("class", "bar_line_close")
    .attr("x1", (d: StockPriceType) => x(d.Date))
    .attr("x2", (d: StockPriceType) => x(d.Date) + barWidth / 2)
    .attr("y1", (d: StockPriceType) => y(d.Close))
    .attr("y2", (d: StockPriceType) => y(d.Close))
    .attr("stroke", (d: StockPriceType) =>
      d.Open < d.Close ? "#30cc5a" : "#f63538",
    )
    .attr("stroke-width", 1);
  chartArea
    .selectAll(".bar_line_open")
    .data(parsedData)
    .enter()
    .append("line")
    .attr("class", "bar_line_open")
    .attr("x1", (d: StockPriceType) => x(d.Date))
    .attr("x2", (d: StockPriceType) => x(d.Date) - barWidth / 2)
    .attr("y1", (d: StockPriceType) => y(d.Open))
    .attr("y2", (d: StockPriceType) => y(d.Open))
    .attr("stroke", (d: StockPriceType) =>
      d.Open < d.Close ? "#30cc5a" : "#f63538",
    )
    .attr("stroke-width", 1);
};

export const deleteBarChart = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.selectAll(".bar").remove();
  chartArea.selectAll(".wick").remove();
  chartArea.selectAll(".bar_line_close").remove();
  chartArea.selectAll(".bar_line_open").remove();
};
