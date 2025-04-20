"use client";
import * as d3 from "d3";
import React, { useEffect, useRef } from "react";
import { ReviewStockType } from "@/types";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSymbolReview } from "@/apis/market.api";

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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorScale = d3.scaleQuantile([-1, 1], colors);
  const paddingInner = 2;
  const paddingOuter = 1;
  const paddingTop = 14;
  const fontSize = paddingTop - 4;

  useEffect(() => {
    if (!canvasRef.current || result.isLoading === true || result.isError === true)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    const nestedData = d3.group(result.data, (d: ReviewStockType) => d.sector);

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

    const width = canvas.clientWidth;
    const height = width

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    const root = d3
      .treemap<TreemapNode>()
      .tile(d3.treemapBinary)
      .size([width, height])
      .paddingInner(paddingInner)
      .paddingOuter(paddingOuter)
      .paddingTop(() => paddingTop)
      .round(true)(
        d3
          .hierarchy(hierarchyData)
          .sum((d) => d.name.length <= 5 ? d.value : 0)
          .sort((a, b) => (b.value || 0) - (a.value || 0))
      );

 ;

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (!root) return;

      // Draw children
      root.children?.forEach(sector => {
        sector.children?.forEach(child => {
          // Draw rectangle
          ctx.fillStyle = colorScale(child.data.change);
          ctx.fillRect(
            child.x0,
            child.y0,
            child.x1 - child.x0,
            child.y1 - child.y0
          );

          // Draw text if box is large enough
          if (child.x1 - child.x0 >= 20 && child.y1 - child.y0 >= 15) {
            const fontSize = handleTextFontSizeChildren(child as Node);
            ctx.fillStyle = '#eeeef0';
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Draw symbol name
            ctx.fillText(
              child.data.name,
              (child.x0 + child.x1) / 2,
              (child.y0 + child.y1) / 2 - fontSize/2
            );

            // Draw change percentage
            ctx.font = `bold ${fontSize-4}px Arial`;
            ctx.fillText(
              child.data.change.toFixed(2) + '%',
              (child.x0 + child.x1) / 2,
              (child.y0 + child.y1) / 2 + fontSize/2
            );
          }
        });
      });

      // Draw parent headers
      root.children?.forEach(child => {
        // Draw header background
        ctx.fillStyle = colorScale(child.data.change);
        ctx.fillRect(
          child.x0 + paddingOuter,
          child.y0,
          child.x1 - child.x0 - paddingOuter,
          paddingTop
        );

        // Draw header text
        ctx.fillStyle = '#f3f3f5';
        ctx.font = `600 ${fontSize}px Arial`;
        ctx.textAlign = 'start';
        ctx.fillText(
          handleTextParent(child as Node),
          child.x0 + 5,
          child.y0 + paddingTop - fontSize/2 + 2
        );

        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(child.x0 + 4, child.y0 + paddingTop);
        ctx.lineTo(child.x0 + 4 + 10/2, child.y0 + paddingTop + 6);
        ctx.lineTo(child.x0 + 4 + 10, child.y0 + paddingTop);
        ctx.fillStyle = colorScale(child.data.change);
        ctx.fill();
        ctx.strokeStyle = '#22262f';
        ctx.stroke();
      });
    };

    draw();

  }, [result.data, result.isLoading, result.isError,colorScale,fontSize,paddingInner,paddingOuter,paddingTop]);

  const handleTextFontSizeChildren = (child: Node) => {
    const boxWidth = child.x1 - child.x0;
    const boxHeight = child.y1 - child.y0;

    if (boxHeight < 20 || boxWidth < 25) return 5;
    if (boxHeight < 25 || boxWidth < 30) return 6;
    if (boxHeight < 30 || boxWidth < 35) return 8;
    if (boxHeight < 35 || boxWidth < 40) return 10;

    return 12;
  };

  const handleTextParent = (parent: Node) => {
    if (parent.data.value > 40000 && parent.data.name.split(" ").length > 2) {
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

  return (
    <div className="flex h-full w-full items-center rounded-sm border-[1px] border-gray-300 p-2 hover:cursor-pointer">
      {result.isLoading && (
        <div className="flex h-[200px] items-center justify-center">
          <LoadingTable />
        </div>
      )}
      <canvas className="w-full" ref={canvasRef} style={{ aspectRatio: "1/1" }} />
    </div>
  );
};

export default Treemap;

const colors = [
  "#f63538",
  "#bf4045",
  "#8b444e",
  "#414554",
  "#35764e",
  "#2f9e4f",
  "#30cc5a",
];

function LoadingTable() {
  return (
    <div className="flex h-[350px] items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}
