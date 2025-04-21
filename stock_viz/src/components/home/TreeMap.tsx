"use client";

import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { ReviewStockType } from "@/types";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSymbolReview } from "@/apis/market.api";
import { getColor as colorScale } from "@/lib/utils";
import Link from "next/link";

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
}

const Treemap = () => {
  const date = format(subYears(new Date(), 1), "yyyy-MM-dd");

  const result = useQuery({
    queryKey: [`symbols/symbols_review`, "treemap", false],
    queryFn: () => getSymbolReview(date, "treemap", false),
    refetchOnWindowFocus: false,
  });

  const ref = useRef<SVGSVGElement | null>(null);
  const [curRoot, setCurRoot] = useState<Node | null>(null);
  const paddingInner = 2;
  const paddingOuter = 1;
  const paddingTop = 16;
  const fontSize = 10;

  console.log(result.data);
  useEffect(() => {
    if (!ref.current || result.isLoading === true || result.isError === true)
      return;
    // d3.select(ref.current).selectAll("*").remove();

    const nestedData = d3.group(
      result.data,
      (d: ReviewStockType) => d.industry,
    );

    // console.log(nestedData)

    const hierarchyData: TreemapNode = {
      name: "Tổng thị trường",
      value: 0,
      change: 0,
      children: Array.from(nestedData, ([industry, stocks]) => ({
        name: industry,
        value: d3.sum(stocks, (d: ReviewStockType) => d.market_cap) || 0,
        change: d3.sum(stocks, (d: ReviewStockType) => d.change) || 0,
        children: stocks.map((stock: ReviewStockType) => ({
          name: stock.symbol,
          value: stock.market_cap,
          change: stock.change,
        })),
      })),
    };

    // hierarchyData.children = hierarchyData.children!.sort((a, b) => b.value - a.value).slice(0, 10)
    // console.log(hierarchyData)
    const width = ref.current?.clientWidth ?? 0;
    const height = ref.current?.clientWidth ?? 0;

    const root = d3
      .treemap<TreemapNode>()
      .tile(d3.treemapBinary)
      .size([width, height])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .paddingTop(() => {
        return paddingTop;
      })
      .round(true)(
      d3
        .hierarchy(hierarchyData)

        .sum((d) => {
          if (d.name.length <= 5) {
            return d.value;
          }
          return 0;
        })
        .sort((a, b) => {
          return (b.value || 0) - (a.value || 0);
        }),
    );
    setCurRoot(root);

    d3.select(ref.current)

      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
  }, [result.data, result.isLoading, result.isError]);

  const handleTextChildren = (child: Node) => {
    const boxWidth = child.x1 - child.x0;
    const boxHeight = child.y1 - child.y0;

    if (boxHeight < 20 || boxWidth < 25) return "5px";
    if (boxHeight < 25 || boxWidth < 30) return "6px";
    if (boxHeight < 30 || boxWidth < 35) return "8px";
    if (boxHeight < 35 || boxWidth < 40) return "10px";

    return "12px";
  };
  const handleTextParent = (child: Node) => {
    if (child.data.value > 40000 && child.data.name.split(" ").length > 2) {
      return child.data.name
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase())
        .join("");
    }

    return child.data.name
      .split(" ")
      .slice(0, 2)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  const handleFontSizeParent = (parent: Node) => {
    const boxWidth = parent.x1 - parent.x0;
    if (handleTextParent(parent).length * fontSize > boxWidth) {
      return 0;
    }
    return 10;
  };

  return (
    <div className="h-full w-full rounded-sm border-[1px] border-gray-300 p-2 hover:cursor-pointer">
      {result.isLoading && (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingTable />
        </div>
      )}
      <Link href={`/maps`}>
      <svg className="w-full" ref={ref}>
        {/* TREE MAP SYMBOLS */}
        <g>
          {curRoot &&
            curRoot?.children.map((child) =>
              child.children.map((child2, index) => (
                <g key={index}>
                  <rect
                    x={child2.x0}
                    y={child2.y0}
                    width={child2.x1 - child2.x0}
                    height={child2.y1 - child2.y0}
                    fill={`${colorScale(child2.data.change)}`}
                  />
                  {child2.x1 - child2.x0 >= 20 &&
                    child2.y1 - child2.y0 >= 15 && (
                      <text
                        x={(child2.x0 + child2.x1) / 2}
                        y={(child2.y0 + child2.y1) / 2}
                        fill="white"
                        fontSize={handleTextChildren(child2)}
                        fontWeight="bold"
                        textAnchor="middle"
                        style={{
                          textShadow: "2px 2px 5px #000",
                          fontFamily:
                            "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                        }}
                      >
                        <tspan dy="-0.5em">{child2.data.name} </tspan>
                        <tspan x={(child2.x0 + child2.x1) / 2} dy="1.2em">
                          {child2.data.change.toFixed(2)}%
                        </tspan>
                      </text>
                    )}
                </g>
              )),
            )}
        </g>

        {/* TREE MAP  SECTORS */}
        <g>
          {curRoot &&
            curRoot?.children.map((child, index) => (
              <g key={index}>
                <rect
                  x={child.x0 + paddingOuter}
                  y={child.y0}
                  width={child.x1 - child.x0 - paddingOuter * 2}
                  height={paddingTop}
                  fill={`${colorScale(child.data.change)}`}
                  stroke="#22262f"
                />
                <text
                  x={child.x0 + 5}
                  y={
                    child.y0 +
                    fontSize +
                    Math.floor((paddingTop - fontSize) / 4)
                  }
                  className="text-industry"
                  textAnchor="start"
                  fill="#f3f3f5"
                  fontSize={handleFontSizeParent(child)}
                  fontWeight="600"
                >
                  {handleTextParent(child)}
                </text>

                {handleFontSizeParent(child) > 0 && (
                  <g>
                    <polygon
                      points={`${child.x0 + 4},${child.y0 + paddingTop} ${child.x0 + 4 + 10 / 2},${child.y0 + paddingTop + 6} ${child.x0 + 4 + 10},${child.y0 + paddingTop} `}
                      stroke="#22262f"
                      transform={`translate(0,0)`}
                      strokeWidth={1}
                      fill={`${colorScale(child.data.change)}`}
                    />
                    <polyline
                      points={`${child.x0 + 4 + 1},${child.y0 + paddingTop} ${child.x0 + 4 + 10 - 1},${child.y0 + paddingTop} `}
                      stroke={`${colorScale(child.data.change)}`}
                      strokeWidth={1}
                    />
                  </g>
                )}
              </g>
            ))}
        </g>
      </svg>
      </Link>

    </div>
  );
};

export default Treemap;

function LoadingTable() {
  return (
    <div className="flex h-[350px] items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}
