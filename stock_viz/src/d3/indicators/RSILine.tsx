import * as d3 from "d3";
import { fetchStock } from "../../api";
import { width, height } from "../../constant";
interface RSIType {
  Date: string;
  RSI: number;
}

// Function to add the RSI chart
const addRSILine = async (
  x: any,
  ric: string,
  dateStart: string,
  dataUsed: number,
  xOrigin: number,
) => {
  removeRSILine();
  const window = 14;

  const response: RSIType[] = await fetchStock(
    `/indicators/RSI?ticker=${ric}&window=${window}`,
  );

  let data: RSIType[] = [];

  for (let i = 0; i < response.length; i++) {
    if (response[i].Date === dateStart) {
      data = response.slice(i + window, response.length);
      break;
    }
  }
  if (data.length === 0) {
    data = response.slice(0, dataUsed - window);
  }

  const isMACD = Number(!d3.select(".MACD-chart-area").empty());
  const MACDHeight = 200;
  const isMFI = Number(!d3.select(".MFI-chart-area").empty());
  const MFIHeight = 150;

  const svg = d3.select(".chart");

  svg.attr("height", height + 150 + isMFI * MFIHeight + isMACD * MACDHeight);

  const xAxis = d3.select(".x-axis-text");
  xAxis.style("transform", `translateY(${height + 250}px)`);

  // Create a separate chart area for RSI
  const RSIChartArea = svg
    .append("g")
    .attr("class", "RSI-chart-area")
    .attr("width", width)
    .attr("height", 100)
    .attr(
      "transform",
      `translate(0, ${height - 100 + isMFI * MFIHeight + isMACD * MACDHeight})`,
    );

  // Define a new Y scale for RSI
  const newY = d3
    .scaleLinear()
    .domain([0, 100]) // Typical RSI range is 0 to 100
    .range([200, 100]);

  const yTicks = newY.ticks(5);
  RSIChartArea.selectAll(".y-axis-text")
    .data(yTicks)
    .enter()
    .append("text")
    .attr("class", "y-axis-text")
    .attr("x", width - 65) // Adjust x position for the text
    .attr("y", (d) => newY(d)) // Position text at the tick value
    .attr("text-anchor", "left") // Align text to the right
    .style("fill", "#616a7a") // Text color
    .style("font-size", "8px")
    .style("text-align", "center") // Bold font
    .style("font-weight", "bold") // Font size
    .text((d) => `${d}%`); // Custom text for the tick

  RSIChartArea.append("text")
    .attr("class", "rsi-title")
    .attr("x", 10) // X position of the title
    .attr("y", 80) // Adjust Y position to place it above the y-axis
    .style("fill", "white") // Title color
    .style("font-size", "12px") // Font size for the title
    .style("font-weight", "bold") // Bold font for the title
    .text("RSI"); // Title text
  // Define the line generator for RSI
  const line = d3
    .line<any>()
    .x((d: any) => (x(d.Date) ?? 0) + x.bandwidth() / 2)
    .y((d: any) => newY(d.RSI));

  // Add the RSI line to the chart
  RSIChartArea.append("path")
    .data([data.slice(0, dataUsed)])
    .attr("class", "rsi-line")
    .attr("d", line)
    .attr("stroke", "#7e57c2")
    .attr("stroke-width", 2)
    .attr("fill", "none");
  RSIChartArea.append("line")
    .attr("x1", 0)
    .attr("x2", width - 80)
    .attr("y1", newY(0) + 10) // Position for the 0% line
    .attr("y2", newY(0) + 10)
    .attr("stroke", "#7e57c2") // Line color
    .attr("stroke-width", 0.3)
    .attr("stroke-dasharray", "3 3"); // Dashed line

  RSIChartArea.append("line")
    .attr("x1", 0)
    .attr("x2", width - 80)
    .attr("y1", newY(100) - 10) // Position for the 100% line
    .attr("y2", newY(100) - 10)
    .attr("stroke", "#7e57c2") // Line color
    .attr("stroke-width", 0.3)
    .attr("stroke-dasharray", "3 3"); // Dashed line
  // d3.select(".x-axis").attr(
  //   "transform",
  //   `translate(0, ${150 + isMFI * MFIHeight + isMACD * MACDHeight})`,
  // );
};

// Function to remove the RSI line and chart area
export const removeRSILine = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select(".rsi-line").remove();

  const svg = d3.select(".chart");
  svg.attr("height", 450);
  d3.select(".x-axis").attr("transform", `translate(0, ${0})`);
  const RSIChartArea = d3.select(".RSI-chart-area");

  RSIChartArea.remove();
};

// Function to hide the RSI line
export const hiddenRSILine = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select(".rsi-line").attr("display", "none");
};

export default addRSILine;
