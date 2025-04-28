"use client";
import React, { useEffect, useRef } from "react";
import {
  scaleBand,
  scaleLinear,
  axisBottom,
  axisRight,
  min,
  max,
  select,
} from "d3";
import { StockPriceDataType } from "@/types";

const OverviewMarketChart = ({
  data,
  chartName,
  closePrice,
}: {
  data: StockPriceDataType[];
  chartName: string;
  closePrice: number;
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [realTimeVolumeHeight, setRealTimeVolumeHeight] = React.useState(0);
  useEffect(() => {
    const totalVolume =
      data.slice(0, data.length - 1).reduce((acc, item) => {
        return acc + item.volume!;
      }, 0) ;


    let realTimeVolumeHeight =
      data[data.length - 1].volume! / ((totalVolume/data.length-1)*2);
    if (realTimeVolumeHeight > 1) {
      realTimeVolumeHeight = realTimeVolumeHeight - Math.floor(realTimeVolumeHeight);
    }
    setRealTimeVolumeHeight(realTimeVolumeHeight);
  }, [data])
  const margin = { top: 20, right: 50, bottom: 10, left: 0 };
  useEffect(() => {
    if (!chartRef.current) return;
    const today = new Date();

    const morningHours = generateTimeLabels(9, 12);
    const afternoonHours = generateTimeLabels(13, 16);
    function generateTimeLabels(startHour: number, endHour: number) {
      const times: string[] = [];
      for (let hour = startHour; hour <= endHour; hour++) {
        const time = new Date(today);
        time.setHours(hour, 0, 0, 0);
        times.push(time.toISOString());
      }
      return times;
    }
    const customDomain = [...morningHours, ...afternoonHours];
    const svg = select(chartRef.current);
    svg.selectAll("*").remove();

    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.attr("width", width).attr("height", height).append("g");

    const xScale = scaleBand()
      .domain(data.map((d) => d.time!))
      .range([margin.left, innerWidth])
      .padding(0.2);

    const customXScale = scaleBand()
      .domain(customDomain)
      .range([margin.left, innerWidth]);

    const yScale = scaleLinear()
      .domain([
        min(data, (d) => Math.min(d.low, d.open, d.close, closePrice))!,
        max(data, (d) => Math.max(d.high, d.open, d.close, closePrice))!,
      ])
      .range([innerHeight, margin.top]);

    // Axes
    g.append("g")
      .attr("transform", `translate(${margin.left}, ${innerHeight})`)
      .call(
        axisBottom(customXScale).tickFormat((d) => {
          const date = new Date(d);
          return `${date.getHours()}h`;
        }),
      )
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll(".tick line").remove();
      })
      .attr("color", "#929cb3")
      .attr("font-size", 12)
      .attr("font-weight", 600);

    g.append("g")
      .call(axisRight(yScale).ticks(6))
      .attr("color", "#929cb3")
      .attr("transform", `translate(${innerWidth}, 0)`)
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll(".tick line").remove();
      })
      .attr("font-size", 12)
      .attr("font-weight", 600);

    g.append("rect")
      .attr("x", 0)
      .attr("transform", `translate(${innerWidth + margin.right - 42}, 0)`)
      .attr("y", yScale(data[data.length - 1].close))
      .attr("width", 35)
      .attr("height", 12)
      .attr("fill", "#f3c736");

    g.append("line")
      .attr("x1", margin.left)
      .attr("x2", innerWidth)
      .attr("y1", yScale(closePrice))
      .attr("y2", yScale(closePrice))
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", 4.2);

    g.append("text")
      .attr("x", 0)
      .attr("transform", `translate(${innerWidth + margin.right - 42}, 0)`)
      .attr("y", yScale(data[data.length - 1].close) + 10)
      .text(data[data.length - 1].close)
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .attr("text-color", "#929cb3");

    // Grid lines
    const gridContainer = g.append("g").attr("class", "grid-container");

    gridContainer
      .selectAll(".grid-x")
      .data(yScale.ticks(6))
      .enter()
      .append("line")
      .attr("class", "grid-x")
      .attr("x1", margin.left)
      .attr("x2", innerWidth)
      .attr("y1", (d) => {
        return yScale(d);
      })
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#c3c6d0")
      .attr("stroke-width", 0.1)
      .attr("stroke-dasharray", 4.2);

    gridContainer
      .selectAll(".grid-y")
      .data(customXScale.domain())
      .enter()
      .append("line")
      .attr("class", "grid-y")
      .attr("x1", (d) => customXScale(d)!)
      .attr("x2", (d) => customXScale(d)!)
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "#c3c6d0")
      .attr("stroke-width", 0.1)
      .attr("stroke-dasharray", 4.2);

    // Candle chart
    const candleContainer = g.append("g").attr("class", "candle-container");
    const candleBodies = candleContainer
      .append("g")
      .attr("class", "candle-bodies");
    const candleWicks = candleContainer
      .append("g")
      .attr("class", "candle-wicks");

    candleBodies
      .selectAll(".candle-body")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "candle")
      .attr("x", (d) => xScale(d.time!)!)
      .attr("y", (d) => yScale(Math.max(d.open, d.close)))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
      .attr("fill", (d) => (d.close > d.open ? "#30cc5a" : "#f63538"));

    // Candle Wicks

    candleWicks
      .selectAll(".wick")
      .data(data)
      .enter()
      .append("line")
      .attr("class", "wick")
      .attr("x1", (d) => xScale(d.time!)! + xScale.bandwidth() / 2)
      .attr("x2", (d) => xScale(d.time!)! + xScale.bandwidth() / 2)
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke", (d) => (d.close > d.open ? "#30cc5a" : "#f63538"))
      .attr("stroke-width", 1);
  }, [
    data,
    closePrice,
    chartRef,
    margin.left,
    margin.right,
    margin.top,
    margin.bottom,
  ]);

  return (
    <div className="border-secondary-3 flex w-full flex-col rounded-lg border-[1px] p-2">
      <div className={`flex items-center gap-6 px-14`}>
        <h2 className="text-md font-bold text-[#929cb3]">{chartName}</h2>
        <span className="text-secondary text-xs font-medium">Apr4</span>
        <span
          className={`${data[data.length - 1].close - closePrice > 0 ? "text-green" : "text-red"} text-md font-semibold`}
        >
          {(data[data.length - 1].close - closePrice).toFixed(2)}(
          {((data[data.length - 1].close - closePrice) / 100).toFixed(2)}%)
        </span>
      </div>

      <div className="flex w-full flex-row justify-between gap-2">
        <div className="flex w-[10%] flex-col">
          <div className="flex flex-row gap-1">
            <div className="flex h-[170px] flex-col-reverse justify-between">
              {ratio.map((item) => (
                <span className="text-secondary-3 text-xs" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <div className="h-[170px] w-2 border-1 border-[#929cb3]">
              <div
                style={{ height: `${100-(100*realTimeVolumeHeight)}%` }}
                className={`bg-transparent`}
              ></div>
              <div style={{ height: `${100*realTimeVolumeHeight}%` }} className={`bg-blue`}></div>
            </div>
          </div>
          <span className="text-2xs text-secondary-3 inline-block font-extralight">
            RealTime <span>Volume</span>
          </span>
        </div>

        <svg className="h-[200px] w-[90%]" ref={chartRef}></svg>
      </div>
    </div>
  );
};

export default OverviewMarketChart;

const ratio = ["0.0", "0.5", "1.0", "1.5", "2.0"];
