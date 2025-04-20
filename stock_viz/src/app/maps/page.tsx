"use client";
import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { ReviewStockType } from "@/types";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSymbolReview } from "@/apis/market.api";
import { getStocksQuote } from "@/apis/stock.api";
import { RiErrorWarningLine } from "react-icons/ri";

interface TreemapNode {
  name: string;
  value: number;
  change: number;
  children?: TreemapNode[];
}

interface Node {
  children: Node[];
  data: TreemapNode;
  depth: number;
  height: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  parent?: Node;
}

const Treemap = () => {
  const date = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const [parentHover, setParentHover] = useState<{
    sector: string;
    industry: string;
    symbol: string;
  } | null>(null);
  const [symbols, setSymbols] = useState<string[]>([]);

  const result = useQuery({
    queryKey: [`symbols/symbols_review`, "treemap", false],
    queryFn: () => getSymbolReview(date, "treemap", false),
    refetchOnWindowFocus: false,
  });

  const industryQuery = useQuery({
    queryKey: [`industry_detail`, parentHover?.industry, date],
    queryFn: () => getStocksQuote(symbols.join(","), date),
    enabled: !!parentHover,
    refetchOnWindowFocus: false,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (
      !canvasRef.current ||
      result.isLoading === true ||
      result.isError === true
    )
      return;
    const colorScale = d3.scaleQuantile(
      [-1, 1],
      colors.map((color) => color.color),
    );
    const paddingInner = 2;
    const paddingOuter = 1;
    const paddingTop = 16;
    const fontSize = paddingTop - 4;

    const handleTextFontSizeSymbol = (symbol: Node) => {
      const boxWidth = symbol.x1 - symbol.x0;
      const boxHeight = symbol.y1 - symbol.y0;

      if (boxHeight < 15 || boxWidth < 20) return "0";
      if (boxHeight < 20 || boxWidth < 25) return "5";
      if (boxHeight < 25 || boxWidth < 30) return "6";
      if (boxHeight < 30 || boxWidth < 35) return "8";
      if (boxHeight < 35 || boxWidth < 40) return "10";
      if (boxHeight < 40 || boxWidth < 45) return "12";
      if (boxHeight < 45 || boxWidth < 50) return "14";
      if (boxHeight < 50 || boxWidth < 55) return "16";
      if (boxHeight < 55 || boxWidth < 60) return "18";
      return "20";
    };

    const handleTextIndustry = (parent: Node) => {
      const boxWidth = parent.x1 - parent.x0;
      if (boxWidth <= 10) return "";

      if (parent.data.name.split(" ").length > 2) {
        return parent.data.name
          .split(" ")
          .map((word: string) => word.charAt(0).toUpperCase())
          .join("");
      }

      return parent.data.name
        .split(" ")
        .slice(0, 2)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
        .trim()
        .toLocaleUpperCase();
    };

    const handleFontSizeIndustry = (industry: Node) => {
      const boxWidth = industry.x1 - industry.x0;
      if (handleTextIndustry(industry).length * 12 > boxWidth) {
        return "0";
      }
      return "12";
    };

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const width = canvas.clientWidth;
    const height = width * 0.5;

    canvas.width = width;
    canvas.height = height;

    const nestedDataBySector = d3.group(
      result.data,
      (d: ReviewStockType) => d.sector,
    );

    const hierarchyData: TreemapNode = {
      name: "Tổng thị trường",
      value: d3.sum(result.data, (d: ReviewStockType) => d.market_cap),
      change: d3.sum(result.data, (d: ReviewStockType) => d.change),
      children: Array.from(
        nestedDataBySector,
        ([sector_name, nestedDataByIndustry]) => ({
          name: sector_name,
          value: d3.sum(nestedDataByIndustry, (d) => d.market_cap),
          change: d3.sum(nestedDataByIndustry, (d) => d.change),
          children: Array.from(
            d3.group(nestedDataByIndustry, (d) => d.industry),
            ([key, value]) => ({
              name: key,
              value: d3.sum(value, (d) => d.market_cap),
              change: d3.sum(value, (d) => d.change),
              children: value.map((d: ReviewStockType) => ({
                name: d.symbol,
                value: d.market_cap,
                change: d.change,
              })),
            }),
          ),
        }),
      ),
    };

    const root = d3
      .treemap<TreemapNode>()
      .tile(d3.treemapBinary)
      .size([width, height])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .paddingTop(() => paddingTop)
      .round(false)(
      d3
        .hierarchy(hierarchyData)
        .sum((d) => d.value)
        .sort((a, b) => (b.value || 0) - (a.value || 0)),
    );

    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!root) return;

      // Draw sectors
      root.children?.forEach((child) => {
        // Draw sector text
        ctx.fillStyle = "#f3f3f5";
        ctx.font = `600 ${fontSize}px Arial`;
        ctx.textAlign = "start";
        ctx.fillText(
          handleTextIndustry(child as Node),
          child.x0 + 5,
          child.y0 + paddingTop - fontSize / 2 + 2,
        );
      });

      // Draw industries
      root.children?.forEach((sector) => {
        sector.children?.forEach((industry) => {
          const isHovered = parentHover?.industry === industry.data.name;

          // Draw industry background
          ctx.fillStyle = isHovered
            ? "yellow"
            : colorScale(industry.data.change);
          ctx.fillRect(
            industry.x0 + paddingOuter,
            industry.y0,
            Math.abs(industry.x1 - industry.x0 - paddingOuter * 2),
            paddingTop,
          );

          // Draw industry text
          ctx.fillStyle = isHovered ? "black" : "#f3f3f5";
          ctx.font = `500 ${handleFontSizeIndustry(industry as Node)}px Arial`;
          ctx.fillText(
            handleTextIndustry(industry as Node),
            industry.x0 + 15,
            industry.y0 + paddingTop - fontSize / 2 + 2,
          );

          // Draw symbols
          industry.children?.forEach((symbol) => {
            if (symbol.x1 - symbol.x0 > 0) {
              ctx.fillStyle = colorScale(symbol.data.change);
              ctx.fillRect(
                symbol.x0,
                symbol.y0,
                symbol.x1 - symbol.x0,
                symbol.y1 - symbol.y0,
              );

              // Draw symbol text if large enough
              const fontSize = handleTextFontSizeSymbol(symbol as Node);
              if (fontSize !== "0") {
                ctx.fillStyle = "white";
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.textAlign = "center";
                ctx.fillText(
                  symbol.data.name,
                  (symbol.x0 + symbol.x1) / 2,
                  (symbol.y0 + symbol.y1) / 2,
                );

                // Draw change percentage
                ctx.font = `bold ${parseInt(fontSize) - 4}px Arial`;
                ctx.fillText(
                  `${symbol.data.change.toFixed(2)}%`,
                  (symbol.x0 + symbol.x1) / 2,
                  (symbol.y0 + symbol.y1) / 2 + parseInt(fontSize),
                );
              }
            }
          });
        });
      });
    };

    // Add mouse event listeners
    // canvas.addEventListener("mousemove", (e) => {
    //   const rect = canvas.getBoundingClientRect();
    //   const x = e.clientX - rect.left;
    //   const y = e.clientY - rect.top;

    //   // Find hovered element
    //   let found = false;
    //   root.children?.forEach((sector) => {
    //     sector.children?.forEach((industry) => {
    //       industry.children?.forEach((symbol) => {
    //         if (
    //           x >= symbol.x0 &&
    //           x <= symbol.x1 &&
    //           y >= symbol.y0 &&
    //           y <= symbol.y1
    //         ) {
    //           setParentHover({
    //             sector: sector.data.name,
    //             industry: industry.data.name,
    //             symbol: symbol.data.name,
    //           });
    //           setSymbols(industry.children?.map((s) => s.data.name) || []);
    //           found = true;
    //         }
    //       });
    //     });
    //   });

    //   if (!found) {
    //     setParentHover(null);
    //   }

    //   draw();
    // });

    canvas.addEventListener("mouseleave", () => {
      setParentHover(null);
      draw();
    });

    // Initial draw
    draw();
  }, [result.data, result.isLoading, result.isError, parentHover]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-6 p-4">
      {result.isLoading && (
        <div className="flex h-[200px] w-full items-center justify-center">
          <LoadingTable />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ aspectRatio: "2/1" }}
      />

      {/* TREE MAP NOTE */}
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <RiErrorWarningLine color="#929cb3" />
          <div className="flex flex-col">
            {warning.map((item, index) => (
              <p key={index} className="text-2xs text-secondary-3 font-bold">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="flex flex-row items-center gap-1">
          {colors.map((color, index) => (
            <p
              key={index}
              style={{ backgroundColor: color.color }}
              className={`px-3 py-1 text-xs font-normal text-white`}
            >
              {color.value}%
            </p>
          ))}
        </div>
      </div>

      {/* Optional: Display industry-specific data when hovering */}
      {parentHover && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 p-2 text-white">
          <h3 className="mb-2 text-lg font-bold">
            {parentHover?.sector} - {parentHover?.industry}-{" "}
            {parentHover?.symbol}
          </h3>
          {industryQuery.isLoading ? (
            <LoadingTable />
          ) : industryQuery.data ? (
            <div className="border-[2px] border-[#22262f] bg-white p-2">
              {industryQuery.data.map(
                (
                  item: {
                    symbol: string;
                    data: {
                      close: number;
                    };
                  },
                  index: number,
                ) => (
                  <div key={index}>
                    <p className="font-bol text-sm text-black">{item.symbol}</p>
                  </div>
                ),
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Treemap;

const warning = [
  "Use mouse wheel to zoom in and out. Drag zoomed map to pan it.",
  "Double‑click a ticker to display detailed information in a new window.",
  "Hover mouse cursor over a ticker to see its main competitors in a stacked view with a 3-month history graph.",
];

const colors = [
  {
    color: "#f63538",
    value: "-3",
  },
  {
    color: "#bf4045",
    value: "-2",
  },
  {
    color: "#8b444e",
    value: "-1",
  },
  {
    color: "#414554",
    value: "0",
  },
  {
    color: "#35764e",
    value: "1",
  },
  {
    color: "#2f9e4f",
    value: "2",
  },
  {
    color: "#30cc5a",
    value: "3",
  },
];

function LoadingTable() {
  return (
    <div className="flex h-[350px] items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}
