import * as d3 from "d3";
import { fetchStock } from "../../api";
import { width, height } from "../../constant";
interface MFILineType {
  Date: string;
  MFI: number;
}

const addMFILine = async (
  x: any,
  ric:string,
  dateStart: string,
  dataUsed: number,
  xOrigin: number,  
) => {
  // Remove any existing MFI chart
  removeMFILine();
  const window = 14;
  

  // Fetch MFI data
  const response: MFILineType[] = await fetchStock(`/indicators/MFI?ticker=${ric}&window=${window}`);  
  let data :MFILineType[]= [];

  for (let i = 0; i < response.length; i++) {
    if (response[i].Date === dateStart) {
      data = response.slice(i+window, response.length);
      break
    }
  }
  if (data.length === 0) {
    data = response.slice(0, dataUsed - window);
  }

  const isRSI = Number(!d3.select(".RSI-chart-area").empty())
  const RSIHeight= 150

  const isMACD = Number(!d3.select(".MACD-chart-area").empty())
  const MACDHeight= 200


  const svg = d3.select(".chart");

  svg.attr("height", height  + 150  + isMACD*MACDHeight + isRSI*RSIHeight);



  // Create a separate chart area for MFI
  const MFIChartArea = svg
    .append("g")
    .attr("class", "MFI-chart-area")
    .attr("width", width)
    .attr("height", 100)
    .attr("transform", `translate(0, ${height - 100 + isMACD*MACDHeight + isRSI*RSIHeight })`);

  // Define a new Y scale for MFI
  const newY = d3
    .scaleLinear()
    .domain([0, 100]) // Typical MFI range is 0 to 100
    .range([200, 100]);

  // Add custom text labels on the y-axis
  const yTicks = newY.ticks(5);
  MFIChartArea.selectAll(".y-axis-text")
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

  // Add a title for the MFI chart
  MFIChartArea.append("text")
    .attr("class", "mfi-title")
    .attr("x", 10) // X position of the title
    .attr("y", 80) // Adjust Y position to place it above the y-axis
    .style("fill", "white") // Title color
    .style("font-size", "12px") // Font size for the title
    .style("font-weight", "bold") // Bold font for the title
    .text("MFI"); // Title text

  // Define the line generator for MFI
  const line = d3
    .line<any>()
    .x((d: any) => (x(d.Date) ?? 0) + x.bandwidth() / 2)
    .y((d: any) => newY(d.MFI));

  // Add the MFI line to the chart
  MFIChartArea.append("path")
    .data([data.slice(0, dataUsed)])
    .attr("class", "mfi-line")
    .attr("d", line)
    .attr("stroke", "#ff7043")
    .attr("stroke-width", 2)
    .attr("fill", "none");

    MFIChartArea.append("line")
    .attr("x1", 0)
    .attr("x2", width-80)
    .attr("y1", newY(0)+10) // Position for the 0% line
    .attr("y2", newY(0)+10)
    .attr("stroke", "#ff7043")  // Line color
    .attr("stroke-width", 0.3)
    .attr("stroke-dasharray", "4 4"); // Dashed line

  MFIChartArea.append("line")
    .attr("x1", 0)
    .attr("x2", width-80)
    .attr("y1", newY(100)-10) // Position for the 100% line
    .attr("y2", newY(100)-10)
    .attr("stroke", "#ff7043")  // Line color
    .attr("stroke-width", 0.3)
    .attr("stroke-dasharray", "3 3"); // Dashed line


  // Adjust x-axis position
  // d3.select(".x-axis").attr("transform", `translate(0, ${ isMACD*MACDHeight + isRSI*RSIHeight+150})`);
};

export default addMFILine;

export const removeMFILine = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select('.MFI-chart-area').remove();
  chartArea.select(".mfi-line").remove();

  const MFIChartArea = d3.select(".MFI-chart-area");
  MFIChartArea.remove();

  
};

export const hiddenMFILine = () => {
  const chartArea = d3.select(".chart-area");
  chartArea.select(".mfi-line").attr("display", "none");
};
