"use client";
import * as d3 from "d3";
import React, { useEffect, useRef, useMemo } from "react";
import { ReviewStockType } from "@/types";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSymbolReview } from "@/apis/market.api";
import { RiErrorWarningLine } from "react-icons/ri";
import { getColor as colorScale } from "@/lib/utils";
import { colorsAndRanges } from "@/constants";
import IndustryHoverCard from "@/components/maps/IndustryHoverCard";
// import { useParentHoverStore } from "@/store";

interface TreemapNode {
  name: string;
  value: number;
  change: number;
  children?: TreemapNode[];
}

interface Node {
  children?: Node[];
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
  const [symbol, setSymbol] =
    React.useState<d3.HierarchyRectangularNode<TreemapNode> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastExecutionRef = useRef<number>(0);
  const throttleInterval = 16; // ~60fps
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);



  const result = useQuery({
    queryKey: [`symbols/symbols_review`, "treemap", false],
    queryFn: () => getSymbolReview(date, "treemap", false),
    refetchOnWindowFocus: false,
  });

  const treeData = useMemo(() => {
    if (!result.data) return null;

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
              children: value
                .map((d: ReviewStockType) => ({
                  name: d.symbol,
                  value: d.market_cap,
                  change: d.change,
                }))
                .sort((a, b) => b.value - a.value),
            }),
          ).sort((a, b) => b.value - a.value),
        }),
      ).sort((a, b) => b.value - a.value),
    };

    const root = d3
      .treemap<TreemapNode>()
      .tile(d3.treemapBinary)
      .size([
        canvasRef.current?.clientWidth || 0,
        (canvasRef.current?.clientWidth || 0) * 0.5,
      ])
      .paddingInner(2)
      .paddingOuter(1)
      .paddingTop(() => 16)
      .round(true)(
      d3
        .hierarchy(hierarchyData)
        .sum((d) => d.value)
        .sort((a, b) => (b.value || 0) - (a.value || 0)),
    );

    return { root };
  }, [result.data]);

  const createQuadtree = useMemo(() => {
    if (!treeData?.root) return null;

    const findSector = (
      root: d3.HierarchyRectangularNode<TreemapNode>,
      x: number,
      y: number,
    ): d3.HierarchyRectangularNode<TreemapNode> | null => {
      if (!root.children) return null;
      for (let i = 0; i < root.children.length; i++) {
        const sector = root.children[i];
        if (
          x >= sector.x0 &&
          x <= sector.x1 &&
          y >= sector.y0 &&
          y <= sector.y1
        ) {
          return sector;
        }
      }
      return null;
    };
    const findIndustry = (
      rootSector: d3.HierarchyRectangularNode<TreemapNode>,
      x: number,
      y: number,
    ): d3.HierarchyRectangularNode<TreemapNode> | null => {
      if (!rootSector.children) return null;
      for (let i = 0; i < rootSector.children.length; i++) {
        const sector = rootSector.children[i];
        if (
          x >= sector.x0 &&
          x <= sector.x1 &&
          y >= sector.y0 &&
          y <= sector.y1
        ) {
          return sector;
        }
      }
      return null;
    };
    const findSymbol = (
      rootIndustry: d3.HierarchyRectangularNode<TreemapNode>,
      x: number,
      y: number,
    ): d3.HierarchyRectangularNode<TreemapNode> | null => {
      if (!rootIndustry.children) return null;
      for (let i = 0; i < rootIndustry.children.length; i++) {
        const symbol = rootIndustry.children[i];
        if (
          x >= symbol.x0 &&
          x <= symbol.x1 &&
          y >= symbol.y0 &&
          y <= symbol.y1
        ) {
          return symbol;
        }
      }
      return null;
    };

    return {
      findSector,
      findIndustry,
      findSymbol,
    };
  }, [treeData]);

  const handleMouseMove = useMemo(() => {
    if (!canvasRef.current || !treeData?.root) {
      return;
    }

    // Add throttling to mouse move events
    return (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastExecutionRef.current < throttleInterval) {
        return;
      }
      lastExecutionRef.current = now;

      if (
        lastPointRef.current?.x === e.clientX &&
        lastPointRef.current?.y === e.clientY
      ) {
        return;
      }

      lastPointRef.current = { x: e.clientX, y: e.clientY };

      const rect = canvasRef.current!.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (createQuadtree && treeData?.root) {
        try {
          const sector = createQuadtree.findSector(treeData.root, x, y);
          if (!sector) return;

          const industry = createQuadtree.findIndustry(sector, x, y);
          if (!industry) return;

          const symbol = createQuadtree.findSymbol(industry, x, y);

          if (symbol && sector && industry) {
            setSymbol(symbol);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
  }, [createQuadtree, treeData]);


  useEffect(() => {
    if (
      !canvasRef.current ||
      result.isLoading === true ||
      result.isError === true
    )
      return;
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
        if (handleTextIndustry(industry).length * 12 > boxWidth * 1.5) {
          return "0";
        }
        return "12";
      };
    if (!treeData || !treeData.root) return;

    const { root } = treeData;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    ctxRef.current = ctx;
    const width = canvas.clientWidth;
    const height = width * 0.5;

    canvas.width = width;
    canvas.height = height;

    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!root) return;

      // Draw sectors
      root.children?.forEach((child) => {
        // Draw sector text
        ctx.fillStyle = "#f3f3f5";
        
        // Add shadow for sector text
        ctx.shadowColor = "rgba(0, 0, 0)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.font = `600 ${fontSize}px Arial`;
        ctx.textAlign = "start";
        ctx.fillText(
          handleTextIndustry(child as Node),
          child.x0 + 5,
          child.y0 + paddingTop - fontSize / 2 + 2,
        );
        
        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      // Draw industries
      root.children?.forEach((sector) => {
        sector.children?.forEach((industry) => {
          const isHovered = symbol?.parent?.data.name === industry.data.name;
         
          if (isHovered) {
            ctx.fillStyle = "yellow";

            ctx.fillRect(
              industry.x0 - paddingOuter,
              industry.y0,
              Math.abs(industry.x1 - industry.x0 + paddingOuter * 2),
              industry.y1 - industry.y0,
            );
          }

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
          
          // Add shadow for industry text
          ctx.shadowColor = "rgba(0, 0, 0)";
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          
          ctx.font = `500 ${handleFontSizeIndustry(industry as Node)}px Arial`;
          ctx.textAlign = "start";
          ctx.fillText(
            handleTextIndustry(industry as Node),
            industry.x0 + 5,
            industry.y0 + paddingTop - fontSize / 2 + 2,
          );
          
          // Reset shadow
          ctx.shadowColor = "transparent";
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

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
                
                // Add text shadow
                ctx.shadowColor = "rgba(0, 0, 0)";
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                
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
                
                // Reset shadow after drawing text
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
              }
            }
          });
        });
      });
    };

    if (handleMouseMove) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    canvas.addEventListener("mouseleave", () => {
      setSymbol(null);
      draw();
    });

    // Initial draw
    draw();
  }, [
    result.data,
    result.isLoading,
    result.isError,
    treeData,
    handleMouseMove,
    symbol,
  ]);
  return (
    <div className="flex w-full flex-col items-center gap-6 p-4">
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
          {colorsAndRanges.map((color, index) => (
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

      {treeData?.root && (
        <IndustryHoverCard
          treeData={treeData.root}
          date={date}
          canvasRef={canvasRef as React.RefObject<HTMLCanvasElement>}
          symbol={symbol}
        />
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

function LoadingTable() {
  return (
    <div className="flex h-[350px] items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}
