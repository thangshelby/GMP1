"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { StockPriceDataType } from "@/types";

const OverviewMarketChart = ({
  data,
  chartName,
}: {
  data: StockPriceDataType[];
  chartName: string;
}) => {
  console.log(data);
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove(); // clear previous chart

    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;

    const margin = { top: 20, right: 5, bottom: 10, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.attr("width", width).attr("height", height).append("g");

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.time!))
      .range([margin.left, innerWidth])
      .padding(0.2);

    const newData = data.filter((d) => {
      const date = new Date(d.time!);
      if (date.getMinutes() == 0) {
        return d.time!;
      }
    });
    const newXScale = d3
      .scaleBand()
      .domain(newData.map((d) => d.time!))
      .range([margin.left, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Math.min(d.low, d.open, d.close))!,
        d3.max(data, (d) => Math.max(d.high, d.open, d.close))!,
      ])
      .range([innerHeight, margin.top]);

    // Axes
    g.append("g")
      .attr("transform", `translate(${margin.right}, ${innerHeight})`)

      .call(
        d3.axisBottom(newXScale).tickFormat((d) => {
          const date = new Date(d);
          return `${date.getHours()}h`;
        }),
      )
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll(".tick line").remove();
      })
      .attr("color", "#c3c6d0");

    g.append("g")
      .call(d3.axisRight(yScale).ticks(6))
      .attr("color", "#c3c6d0")
      .attr("transform", `translate(${innerWidth}, 0)`)
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll(".tick line").remove();
      });

    const gridContainer = g.append("g").attr("class", "grid-container");
    gridContainer
      .selectAll(".grid-x")
      .data(yScale.ticks(6))
      .enter()
      .append("line")
      .attr("class", "grid-x")
      .attr("x1", (d) => margin.left)
      .attr("x2", (d) => innerWidth)
      .attr("y1", (d) => {
        return yScale(d);
      })
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#c3c6d0")
      .attr("stroke-width", 0.1)
      .attr("stroke-dasharray", 4.2);

    gridContainer.selectAll(".grid-y")
    .data(newXScale.domain())
    .enter()
    .append("line")
    .attr("class", "grid-y")
    .attr("x1", (d) => newXScale(d)! + newXScale.bandwidth() / 2)
    .attr("x2", (d) => newXScale(d)! + newXScale.bandwidth() / 2)
    .attr("y1", 0)
    .attr("y2", innerHeight)
    .attr("stroke", "#c3c6d0")
    .attr("stroke-width", 0.1)
    .attr("stroke-dasharray", 4.2);
    

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
  }, [data]);

  return (
    <div className="border-secondary flex w-full flex-col rounded-lg border-1 p-2">
      <div className="flex pl-1 items-center gap-4">
        <h2 className="text-secondary text-md font-semibold">{chartName}</h2>
        <span className="text-xs text-secondary font-thin">Apr4</span>
        <span className="text-green text-sm font-semibold">+1753(20%)</span>
      </div>
      <svg className="h-[200px] w-full" ref={chartRef}></svg>
    </div>
  );
};

export default OverviewMarketChart;
