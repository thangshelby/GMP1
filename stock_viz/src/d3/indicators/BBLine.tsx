import * as d3 from "d3";
import { fetchStock } from "../../api";

const bbandKeys: Array<"BB_lower" | "BB_middle" | "BB_upper"> = [
  "BB_lower",
  "BB_middle",
  "BB_upper",
];
const addBBLine = async (
  x: any,
  ric: string,
  dateStart: string,
  y: any,
  dataUsed: number,
  xOrigin: number,
) => {
  
  removeBBLine();
  const window = 20
  const response = await fetchStock(
    `/indicators/BB?ticker=${ric}&window=${window}`,
  );
  let data = [];

  for (let i = 0; i < response.length; i++) {
    if (response[i].Date === dateStart) {
      data = response.slice(i+window, response.length);
      break
    }
  }
  if (data.length === 0) {
    data = response.slice(0, dataUsed - window);
  }

  const chartArea = d3.select(".chart-area");
  const lineGenerator = (key: "BB_lower" | "BB_middle" | "BB_upper") =>
    d3
      .line<{ Date: string } & { [key: string]: number }>()
      .x((d) => (x(d.Date) ?? 0) + x.bandwidth() / 2)
      .y((d) => y(d[key]));

  const areaGenerator = d3
    .area<{ Date: string; BB_lower: number; BB_upper: number }>()
    .x((d) => (x(d.Date) ?? 0) + x.bandwidth() / 2) // Center the area
    .y0((d) => y(d.BB_lower))
    .y1((d) => y(d.BB_upper))
    .curve(d3.curveBasis);
  chartArea
    .append("path")
    .datum(data.slice(0, dataUsed))
    .attr("class", "bband-area")
    .attr("d", areaGenerator)
    .attr("fill", "rgba(135, 206, 235, 0.1)")
    .attr("transform", `translate(${xOrigin},0)`);
  bbandKeys.forEach((key, i) => {
    chartArea
      .append("path")
      .datum(data.slice(0, dataUsed)) // Bind BB data
      .attr("class", `${key.toLowerCase()}-line`)
      .attr("d", lineGenerator(key)!)
      .attr("stroke", i === 0 || i === 2 ? "#2196f3" : "#fd8429") // Blue for upper/lower, orange for middle
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("transform", `translate(${xOrigin},0)`);
  });
};
export default addBBLine;

export const removeBBLine = () => {
  const chartArea = d3.select(".chart-area");

  chartArea.select(".bband-area").remove();

  bbandKeys.forEach((key) => {
    chartArea.select("." + key.toLocaleLowerCase() + "-line").remove();
  });
};

export const hiddenBBLine = () => {
  const chartArea = d3.select(".chart-area");

  chartArea.select(".bband-area").style("display", "none");

  bbandKeys.forEach((key) => {
    chartArea
      .select("." + key.toLocaleLowerCase() + "-line")
      .style("display", "none");
  });
};
