import * as d3 from "d3";
import { StockPriceType } from "../../type";
export const createLineChart = (
  x: any,
  y: any,
  parsedData: StockPriceType[],
) => {
  const chartArea = d3.select(".chart-area");
  const lineGenerator = d3
    .line<StockPriceType>()
    .x((d: StockPriceType) => x(d.Date)) // Use the x scale for the Date
    .y((d: StockPriceType) => y(d.Close)) // Use the y scale for the Close price
    .curve(d3.curveMonotoneX); // Add smoothing to the line (optional)

  chartArea
    .append("path")
    .datum(parsedData) // Bind the data to the path element
    .attr("class", "line-chart")
    .attr("d", lineGenerator) // Generate the path data using the line generator
    .attr("fill", "none") // Ensure the path is not filled
    .attr("stroke", "#2962ff") // Set the line color
    .attr("stroke-width", 2); // Set the line width


};

export const deleteLineChart = () => {
    const chartArea = d3.select(".chart-area");
    chartArea.select(".line-chart").remove();
    chartArea.selectAll(".data-point").remove();
}
