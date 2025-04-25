import React from "react";
import { StockPriceDataType } from "@/types";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  scaleBand,
  scaleLinear,
  axisBottom,
  axisRight,
  min,
  max,
  group,
  select,
} from "d3";
import { format, subYears, subMonths } from "date-fns";
import { getStockQuote } from "@/apis/stock.api";
import { useQuery } from "@tanstack/react-query";
import { ReviewStockType } from "@/types";
import { monthMap } from "@/constants";

const StockQuoteOverview = ({
  position,
  infomation,
}: {
  position: {
    top: number;
    left: number;
  };
  infomation: ReviewStockType;
}) => {
  const start_date = format(
    subMonths(subYears(new Date(), 1), 3),
    "yyyy-MM-dd",
  );
  const end_date = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const interval = "1D";

  const chartRef = React.useRef<SVGSVGElement | null>(null);

  const result = useQuery({
    queryKey: [
      "stocks/stock_quote",
      infomation.symbol,
      start_date,
      end_date,
      interval,
      "1D",
    ],
    queryFn: () =>
      getStockQuote(infomation.symbol, start_date, end_date, interval),
  });

  useEffect(() => {
    if (!chartRef.current || !result.isSuccess) return;

    const data: StockPriceDataType[] = result.data;

    const margin = { top: 10, right: 0, bottom: 10, left: 30 };

    const dataGroupByMonth = Array.from(
      group(data, (d) => new Date(d.time!).getMonth()),
    );

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

    const xScaleForMonth = scaleBand()
      .domain(
        dataGroupByMonth.map((item) => {
          return item[0].toString();
        }),
      )
      .range([margin.left, innerWidth]);

    const yScale = scaleLinear()
      .domain([
        min(data, (d) => Math.min(d.low, d.open, d.close))! * 0.9,
        max(data, (d) => Math.max(d.high, d.open, d.close))! * 1.1,
      ])
      .range([innerHeight, margin.top]);
    const yScaleForVolume = scaleLinear()
      .domain([
        min(data, (d) => Math.min(d.volume!))!,
        max(data, (d) => Math.max(d.volume!))!,
      ])
      .range([innerHeight, innerHeight - 10]);

    // Axes
    g.append("g")
      .attr("transform", `translate(${margin.left}, ${innerHeight})`)
      .call(
        axisBottom(xScaleForMonth).tickFormat((d) => {
          return monthMap[parseInt(d as string) + 1];
        }),
      )
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll(".tick line").remove();
      })
      .attr("color", "#929cb3")
      .attr("font-size", 10)
      .attr("font-weight", 500);

    g.append("g")
      .call(axisRight(yScale).ticks(6))
      .attr("color", "#929cb3")
      .attr("transform", `translate(${innerWidth}, 0)`)
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll(".tick line").remove();
      })
      .attr("font-size", 10)
      .attr("font-weight", 500);

    g.append("rect")
      .attr("x", 0)
      .attr("transform", `translate(${innerWidth + margin.right}, 0)`)
      .attr("y", yScale(data[data.length - 1].close))
      .attr("width", 24)
      .attr("height", 12)
      .attr("fill", "#f3c736");

    g.append("text")
      .attr("x", 0)
      .attr("transform", `translate(${innerWidth + margin.right}, 0)`)
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
      .data(xScaleForMonth.domain())
      .enter()
      .append("line")
      .attr("class", "grid-y")
      .attr("x1", (d) => {
        return xScaleForMonth(d)! + 32;
      })
      .attr("x2", (d) => xScaleForMonth(d)! + 32)
      .attr("y1", margin.top)
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

    // Volume chart
    const volumeContainer = g.append("g").attr("class", "volume-container");
    const volumeBars = volumeContainer.append("g").attr("class", "volume-bars");

    volumeBars
      .selectAll(".volume-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "volume-bar")
      .attr("x", (d) => xScale(d.time!)!)
      .attr("y", (d) => yScaleForVolume(d.volume!))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => {
        // return 10
        return Math.abs(innerHeight - yScaleForVolume(d.volume!));
      })
      .attr("fill", (d) => (d.close > d.open ? "#297944" : "#913239"));
    // Volume Axis
  }, [result.data, result.isSuccess]);
  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 9999,
      }}
    >
      <div className="border-secondary flex h-56 w-80 flex-col overflow-hidden rounded-lg border-[1px] bg-[#22262f] shadow-lg transition-all duration-300 ease-in-out">
        <div className="relative flex-1">
          <div className="absolute top-2 left-0 w-full">
            <div className="flex flex-row items-start justify-between px-2 pr-4">
              <div className="flex flex-row gap-1">
                <span className="text-md text-start font-semibold text-[#656d7d]">
                  {infomation.symbol}
                </span>
                <span className="text-2xs text-sub_text">
                  {monthMap[new Date().getMonth() + 1]}{" "}
                  {new Date().getDate()}{" "}
                </span>
              </div>
              <div className="flex flex-row gap-1">
                <span
                  className={`${infomation.change > 0 ? "text-green" : "text-red"} text-2xs font-semibold`}
                >
                  {infomation.change.toFixed(2)} (
                  {(infomation.change / infomation.last).toFixed(2)}%)
                </span>
                <span className="text-2xs text-primary">© StockViz.com</span>
              </div>
            </div>
          </div>

          <div className="absolute top-[30%] rotate-270 text-start">
            <p className="text-xs font-[900] text-[#656d7d]">DAILY</p>
          </div>
          <svg className="h-full w-full" ref={chartRef}></svg>
        </div>

        <div className="bg-button flex flex-col p-2">
          <p className="text-2xs font-semibold text-[#efeff1]">
            {infomation.name}
          </p>
          <div className="flex flex-row items-center gap-2">
            <span className="text-2xs text-sub_text font-medium">
              {infomation.industry}
            </span>

            <span className="text-2xs text-sub_text font-medium">VietNam</span>

            <span className="text-2xs text-sub_text font-medium">
              {infomation.market_cap} VND
            </span>
          </div>
        </div>
      </div>
    </div>,
    portalRoot,
  );
};

export default StockQuoteOverview;


