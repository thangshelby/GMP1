"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { ReviewStockType, TreemapNodeType, NodeType } from "@/types";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSymbolReview } from "@/apis/market.api";
import { RiErrorWarningLine } from "react-icons/ri";
import { getColor as colorScale } from "@/lib/utils";
import { colorsAndRanges } from "@/constants";
import IndustryHoverCard from "@/components/maps/IndustryHoverCard";
import {
  treemapBinary,
  hierarchy,
  group,
  sum,
  treemap,
  HierarchyRectangularNode,
} from "d3";
import { useSearchParams } from "next/navigation";
import { handleTextIndustry, handleTextFontSizeSymbol, handleFontSizeIndustry, paddingOuter, paddingTop, fontSize } from "@/constants/treeMap";
import LoadingTable from "@/components/ui/Loading";
const Treemap = () => {
  const date = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const [symbol, setSymbol] =
    React.useState<HierarchyRectangularNode<TreemapNodeType> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastExecutionRef = useRef<number>(0);
  const throttleInterval = 16; // ~60fps
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const searchParams = useSearchParams();
  const exchange = searchParams.get("exchange") || "top_500";
  const timeframe = searchParams.get("timeframe") || "1Y";

  const result = useQuery({
    queryKey: [`symbols/symbols_review`, exchange, timeframe],
    queryFn: () => getSymbolReview(date, exchange, timeframe),
    refetchOnWindowFocus: false,
  });



  //CREATE DATA FOR TREE MAP
  const treeData = useMemo(() => {
    if (!result.data) return null;
    console.log(result.data);
    const nestedDataBySector = group(
      result.data,
      (d: ReviewStockType) => d.sector,
    );

    const hierarchyData: TreemapNodeType = {
      name: "Tổng thị trường",
      children: Array.from(
        nestedDataBySector,
        ([sector_name, nestedDataByIndustry]) => ({
          name: sector_name,
          children: Array.from(
            group(nestedDataByIndustry, (d) => d.industry),
            ([key, value]) => ({
              name: key,
              change: sum(value, (d) => d.change),
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

    const hierachy = hierarchy(hierarchyData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const root = treemap<TreemapNodeType>()
      .tile(treemapBinary)
      .size([
        canvasRef.current?.clientWidth || 0,
        (canvasRef.current?.clientWidth || 0) * 0.5,
      ])
      .paddingInner(2)
      .paddingOuter(1)
      .paddingTop(() => 16)
      .round(true)(hierachy);

    return { root, hierarchyData, hierachy };
  }, [result.data]);

  // CREATE DATA STRUCTURE HELP FIND NODE FASTER
  const createQuadtree = useMemo(() => {
    if (!treeData?.root) return null;

    const findNode = (
      root: HierarchyRectangularNode<TreemapNodeType>,
      x: number,
      y: number,
      targetDepth: number,
    ): HierarchyRectangularNode<TreemapNodeType> | null => {
      if (!root.children || targetDepth == root.depth) return root;
      for (let i = 0; i < root.children.length; i++) {
        const node = root.children[i];
        const isMousePositionInNode =
          x >= node.x0 && x <= node.x1 && y >= node.y0 && y <= node.y1;
        if (isMousePositionInNode) {
          return findNode(node, x, y, targetDepth);
        }
      }
      return null;
    };

    return {
      findNode,
    };
  }, [treeData]);

  // HANDLE MOUSE MOVE FOR DETECT SYMBOL
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
        const symbol = createQuadtree.findNode(treeData.root, x, y, 3);
        if (symbol) {
          setSymbol(symbol);
          return;
        } else {
          const isOutOfIndustryBoundary = createQuadtree.findNode(
            treeData.root,
            x,
            y,
            1,
          );

          if (!isOutOfIndustryBoundary) {
            setSymbol(null);
          }
        }
      }
    };
  }, [createQuadtree, treeData]);

  //DRAW TREE MAP
  useEffect(() => {
    if (
      !canvasRef.current ||
      result.isLoading === true ||
      result.isError === true
    )
      return;
 
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
        ctx.fillStyle = "#ffffff  ";

        ctx.font = `600 ${fontSize}px Arial`;
        ctx.textAlign = "start";
        ctx.fillText(
          handleTextIndustry(child as unknown as NodeType),
          child.x0 + 5,
          child.y0 + paddingTop - fontSize / 2 + 2,
        );
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
          // Draw symbols
          industry.children?.forEach((symbol) => {
            if (symbol.x1 - symbol.x0 > 0) {
              ctx.fillStyle = colorScale(symbol.data.change || 0);
              ctx.fillRect(
                symbol.x0,
                symbol.y0,
                symbol.x1 - symbol.x0,
                symbol.y1 - symbol.y0,
              );

              // Draw symbol text if large enough
              const fontSize = handleTextFontSizeSymbol(symbol as unknown as NodeType);

              if (fontSize !== "0") {
                ctx.fillStyle = "white";

                // Add text shadow
                ctx.shadowColor = "rgba(0, 0, 0)";
                ctx.shadowBlur = 5;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 4;

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
                  `${(symbol.data.change || 0).toFixed(2)}%`,
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

          // Draw industry background
          const totalIndustryMarketCap = industry.children?.reduce(
            (acc, child) => acc + (child.data.value || 0),
            0,
          );
          const industryFillStyle = isHovered
            ? "yellow"
            : colorScale(
                industry.children?.reduce(
                  (acc, child) =>
                    acc +
                    (child.data.change || 0) *
                      ((child.data.value || 0) / (totalIndustryMarketCap || 0)),
                  0,
                ) || 0,
              );
          ctx.fillStyle = industryFillStyle;
          ctx.fillRect(
            industry.x0 + paddingOuter,
            industry.y0,
            Math.abs(industry.x1 - industry.x0 - paddingOuter * 2),
            paddingTop - 1,
          );

          ctx.beginPath();
          ctx.moveTo(
            industry.x0 + 5 + 10 / 2,
            industry.y0 + paddingTop - 2 + 6,
          );
          ctx.lineTo(industry.x0 + 5, industry.y0 + paddingTop);
          ctx.closePath();
          ctx.strokeStyle = isHovered ? "yellow" : "#22262f";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = industryFillStyle;

          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(
            industry.x0 + 5 + 10 / 2,
            industry.y0 + paddingTop - 2 + 6,
          );
          ctx.lineTo(industry.x0 + 5 + 10, industry.y0 + paddingTop);
          ctx.closePath();
          ctx.stroke();

          // Draw the triangle (non-straight shape)
          ctx.beginPath();
          ctx.moveTo(
            industry.x0 + 5 + 10 / 2,
            industry.y0 + paddingTop - 2 + 6,
          );
          ctx.lineTo(industry.x0 + 5, industry.y0 + paddingTop);
          ctx.lineTo(industry.x0 + 5 + 10, industry.y0 + paddingTop);
          ctx.closePath();
          ctx.strokeStyle = isHovered ? "yellow" : "#22262f";
          ctx.fillStyle = industryFillStyle;
          ctx.stroke();
          ctx.fill();

          // Draw bottom line of the tab
          ctx.beginPath();
          ctx.moveTo(industry.x0 + 7, industry.y0 + paddingTop);
          ctx.lineTo(industry.x0 + 3 + 10, industry.y0 + paddingTop);
          ctx.closePath();
          ctx.strokeStyle = isHovered ? "yellow" : industryFillStyle;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Draw industry text
          ctx.fillStyle = isHovered ? "black" : "#ffffff";

          ctx.font = `300 ${handleFontSizeIndustry(industry as unknown as NodeType)}px Arial`;
          ctx.textAlign = "start";
          ctx.fillText(
            handleTextIndustry(industry as unknown as NodeType),
            industry.x0 + 5,
            industry.y0 + paddingTop - fontSize / 2 + 2,
          );
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
    <div className="flex w-full flex-col items-center gap-6 p-4 overflow-hidden">
      {result.isLoading && (
        <div className="flex h-[200px] w-full items-center justify-center">
          <LoadingTable />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full "
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
              className={`px-4 py-1 text-xs font-normal text-white`}
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

