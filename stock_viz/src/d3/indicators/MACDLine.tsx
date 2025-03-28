import * as d3 from "d3";
import { fetchStock } from "../../api";
import { width, height } from "../../constant";
import { StockPriceType } from "../../type";
interface MACDType {
  Date: string;
  MACD: number;
  MACD_signal: number;
  MACD_hist: number;
}
const addMACDLine = async (
  x: any,
  ric: string,
  dateStart: string,
  dataUsed: number,
  xOrigin: number,
) => {
  // Remove any existing MACD chart
  removeMACDLine();
  const window = 9;
  const fast = 12;
  const slow = 26;
  // Fetch MACD data
  const response: MACDType[] = await fetchStock(
    `/indicators/MACD?ticker=${ric}&window=${window}&fast=${fast}&slow=${slow}`,
  );

  
  let data:MACDType[]= [];

  for (let i = 0; i < response.length; i++) {
    if (response[i].Date === dateStart) {
      data = response.slice(i+window, response.length);
      break
    }
  }
  if (data.length === 0) {
    data = response.slice(0, dataUsed - window);
  }

  const isRSI = Number(!d3.select(".RSI-chart-area").empty());
  const RSIHeight = 150;
  const isMFI = Number(!d3.select(".MFI-chart-area").empty());
  const MFIHeight = 150;

  const svg = d3.select(".chart");

  svg.attr("height", height + 200 + isMFI * MFIHeight + isRSI * RSIHeight);

  // Create a separate chart area for MACD
  const MACDChartArea = svg
    .append("g")
    .attr("class", "MACD-chart-area")
    .attr("width", width)
    .attr("height", 200)
    .attr(
      "transform",
      `translate(0, ${height - 100 + isMFI * MFIHeight + isRSI * RSIHeight})`,
    );

  // Define a new Y scale for MACD
  const maxMACD = d3.max(data, (d) => d.MACD) ?? 100;
  const minMACD = d3.min(data, (d) => d.MACD) ?? 0;

  const maxMACD_signal = d3.max(data, (d) => d.MACD_signal) ?? 100;
  const minMACD_signal = d3.min(data, (d) => d.MACD_signal) ?? 0;

  const domain = [
    Math.min(minMACD, minMACD_signal) * 1.2,
    Math.max(maxMACD, maxMACD_signal) * 1.2,
  ];
  const newY = d3
    .scaleLinear()
    .domain(domain) // Set domain based on MACD values
    .range([300, 100]);

  // Add custom text labels on the y-axis
  const yTicks = newY.ticks(5);
  MACDChartArea.selectAll(".y-axis-text")
    .data(yTicks)
    .enter()
    .append("text")
    .attr("class", "y-axis-text")
    .attr("x", width - 65) // Adjust x position for the text
    .attr("y", (d) => newY(d)) // Position text at the tick value
    .attr("text-anchor", "left") // Align text to the right
    .style("fill", "#616a7a") // Text color
    .style("font-size", "8px")
    .style("font-weight", "bold") // Font weight
    .text((d) => `${d.toFixed(2)}`); // Custom text for the tick

  // Add a title for the MACD chart
  MACDChartArea.append("text")
    .attr("class", "macd-title")
    .attr("x", 10) // X position of the title
    .attr("y", 100) // Adjust Y position to place it above the y-axis
    .style("fill", "white") // Title color
    .style("font-size", "12px") // Font size for the title
    .style("font-weight", "bold") // Bold font for the title
    .text("MACD"); // Title text

  // Define the line generator for MACD
  const line = d3
    .line<any>()
    .x((d: any) => (x(d.Date) ?? 0) + x.bandwidth() / 2)
    .y((d: any) => newY(d.MACD));

  const signalLine = d3
    .line<any>()
    .x((d: any) => (x(d.Date) ?? 0) + x.bandwidth() / 2)
    .y((d: any) => newY(d.MACD_signal));

  MACDChartArea.selectAll(".macd-hist-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "macd-hist-bar")
    .attr("x", (d: any) => x(d.Date) ?? 0)
    .attr("y", (d: any) => newY(Math.max(0, d.MACD_hist)))
    .attr("width", 6)
    .attr("height", (d: any) => Math.abs(newY(0) - newY(d.MACD_hist)))
    .style("fill", (d: any, i: number) => {
      const previousHist = i > 0 ? data[i - 1].MACD_hist : 0; // MACD_hist của ngày trước đó

      if (d.MACD_hist > 0) {
        // MACD_hist > 0
        if (d.MACD_hist > previousHist) {
          return "#22ab94"; // Xanh đậm khi MACD_hist tăng
        } else {
          return "#ace5dc"; // Xanh nhạt khi MACD_hist giảm
        }
      } else {
        // MACD_hist < 0
        if (d.MACD_hist < previousHist) {
          return "#ff5252"; // Đỏ đậm khi MACD_hist giảm
        } else {
          return "#fccbcd"; // Đỏ nhạt khi MACD_hist tăng
        }
      }
    });

  // Add the MACD line to the chart
  MACDChartArea.append("path")
    .data([data.slice(0, dataUsed)])
    .attr("class", "macd-line")
    .attr("d", line)
    .attr("stroke", "#42a5f5") // Color for MACD line XANh
    .attr("stroke-width", 2)
    .attr("fill", "none");

  // Add MACD signal line
  MACDChartArea.append("path")
    .data([data.slice(0, dataUsed)])
    .attr("class", "macd-signal-line")
    .attr("d", signalLine)
    .attr("stroke", "#ff7043") //CAM
    .attr("stroke-width", 2)
    .attr("fill", "none");

  // Add MACD histogram

  // Adjust x-axis position
  // d3.select(".x-axis").attr(
  //   "transform",
  //   `translate(0, ${200 + isMFI*MFIHeight + isRSI*RSIHeight})`,
  // );
};

export default addMACDLine;

export const removeMACDLine = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select(".MACD-chart-area").remove();
  chartArea.select(".macd-line").remove();

  const MACDChartArea = d3.select(".MACD-chart-area");
  MACDChartArea.remove();
};

export const hiddenMACDLine = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select(".macd-line").attr("display", "none");
};
