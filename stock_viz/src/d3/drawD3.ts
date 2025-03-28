import * as d3 from "d3";
// import { height, width } from '@'
import { StockPriceDataType } from "@/types";

const width = 1200;
const height = 500;
export const createAxix = (
  chartArea: any,
  x: any,
  y: any,
  data: StockPriceDataType[],
) => {
  const xDomain = d3.extent(data, (d) => new Date(d.date)) as [Date, Date];
  xDomain[1] = d3.timeDay.offset(xDomain[1], -1); // Shift the end date back by 1 day

  const newX = d3
    .scaleTime()
    .domain(xDomain)
    .range([-(data.length - 112) * 10, width - 80]);

  const xAxis = d3
    .axisBottom(newX)
    .ticks(d3.timeMonth.every(1)) // Tick mỗi tháng
    .tickFormat((domainValue: Date | d3.NumberValue) =>
      d3.timeFormat("%b %Y")(
        domainValue instanceof Date
          ? domainValue
          : new Date(domainValue.valueOf()),
      ),
    );

  const xAxisGroup = chartArea.append("g").call(xAxis).attr("class", "x-axis");
  xAxisGroup
    .selectAll("text")
    .attr("class", "x-axis-text")
    .attr("transform", "translate(0,100)"); // Rotate x-axis text;

  xAxisGroup.selectAll("path, line").remove();
  xAxisGroup
    .selectAll("text")
    .style("fill", "#616a7a") // X-axis text color
    .style("font-size", "8px")
    .attr("class", `x-axis-text`)
    .style("font-weight", "bold")
    .style("transform", `translateY(${height - 40}px)`);

  const yAxis = d3.axisRight(y);

  const yAxisGroup = chartArea.append("g").call(yAxis);
  yAxisGroup.selectAll("path, line").remove();

  yAxisGroup
    .selectAll("text")
    .style("fill", "#616a7a") // Y-axis text color
    .style("font-size", "8px")
    .style("font-weight", "bold")
    .style("transform", `translateX(${width - 80}px)`);
  // Style x-axis and y-axis lines
  chartArea.selectAll(".x-axis path, .x-axis line").style("stroke", "#616a7a");

  chartArea.selectAll(".y-axis path, .y-axis line").style("stroke", "#616a7a"); // Y-axis color

  //DRAW GRID
  chartArea.selectAll(".grid").remove();
  chartArea
    .append("g")
    .attr("class", "grid")
    .attr("transform", `translate(0, ${height - 50})`)
    .call(
      d3
        .axisBottom(newX)
        .tickSize(-height)
        .tickFormat(() => ""),
    );
  chartArea
    .selectAll(".grid line")
    .filter(function (_: any, i: number) {
      return i === 0;
    })
    .remove();
  chartArea.selectAll(".grid").style("stroke", "#616a7a"); // Grid color
  chartArea.selectAll(".grid line").style("stroke", "#616a7a"); // Grid color
  chartArea.selectAll(".grid path").style("stroke", "#616a7a"); // Grid color

  chartArea
    .append("g")
    .attr("class", "grid-row")
    .attr("transform", `translate(${width - 80}, 0)`)
    .call(
      d3
        .axisRight(y)
        .tickSize(-width)
        .tickFormat(() => ""),
    );

  chartArea.selectAll(".grid-row").style("stroke", "#616a7a"); // Grid color
  chartArea.selectAll(".grid-row line").style("stroke", "#616a7a"); // Grid color
  chartArea.selectAll(".grid-row path").style("stroke", "#616a7a"); // Grid color
};

//Create Candlestick Chart


export const drawVerticalAndHorizontalLine = () => {
  const chartArea = d3.select(".chart-area");

  chartArea
    .append("line")
    .attr("class", "vertical_line")
    .attr("y1", 0)
    .attr("y2", height - 50)
    .style("stroke", "#616a7a")
    .style("opacity", 0);

  chartArea
    .append("rect")
    .attr("class", "vertical_rect")
    .attr("x", 0) // Initial x position
    .attr("y", 0) // Initial y position
    .style("opacity", 0) // Initially hidden
    .style("fill", "black")
    .style("width", "30px") // Width of the rectangle
    .style("height", "15px"); // Height of the rectangle
  chartArea
    .append("text")
    .attr("class", "vertical_label")
    .attr("x", 0) // Initial x position
    .attr("y", 0) // Initial y position
    .style("opacity", 0) // Initially hidden
    .style("font-size", "8px")
    .style("fill", "white");

  chartArea
    .append("line")
    .attr("class", "horizontal_line")
    .attr("x1", 0)
    .attr("x2", width - 80)
    .style("stroke", "#616a7a")
    .style("opacity", 0);

  chartArea
    .append("rect")
    .attr("class", "horizontal_rect")
    .attr("x", 0) // Initial x position
    .attr("y", 0) // Initial y position
    .style("opacity", 0) // Initially hidden
    .style("fill", "black")
    .style("width", "60px") // Width of the rectangle
    .style("height", "15px"); // Height of the rectangle

  chartArea
    .append("text")
    .attr("class", "horizontal_label")
    .attr("x", 0) // Initial x position
    .attr("y", 0) // Initial y position
    .style("opacity", 0) // Initially hidden
    .style("font-size", "8px")
    .style("fill", "white");
};
