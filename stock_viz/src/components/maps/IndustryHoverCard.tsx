import React, { useRef, useEffect, useState, RefObject} from "react";
import LineChartSimple from "./LineChartSimple";
import { getColor as colorScale } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getStocksQuote } from "@/apis/stock.api";
import { HierarchyRectangularNode } from "d3";
import { useParentHoverStore } from "@/store";
interface TreemapNode {
  name: string;
  value: number;
  change: number;
  children?: TreemapNode[];
}

interface IndustryHoverCardProps {
  parentHover: {
    symbol: string;
    sector: string;
    industry: string;
    symbols: string[];
  }|null;
  treeData: HierarchyRectangularNode<TreemapNode>;
  date: string;
  canvasRef: RefObject<HTMLCanvasElement>;
}

interface StockData {
  data: {
    symbol: string;
    change: number;
    last: number;
    name: string;
    volume: number;
    market_cap: number;
    industry: string;
    sector: string;
  };
  quote: number[];
}

const IndustryHoverCard= ({  date, canvasRef }: IndustryHoverCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

const {parentHover} = useParentHoverStore();
  useEffect(()=>{
   console.log('re-render becase of parentHover',parentHover)
  },[])

  const industryQuery = useQuery({
    queryKey: [`industry_detail`, parentHover?.industry, date],
    queryFn: () => parentHover ? getStocksQuote(parentHover.symbols.join(","), date) : null,
    enabled: !!parentHover && parentHover.symbols.length > 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const handleMouseMove = (
      e: MouseEvent) => {
      const x = e.clientX,
        y = e.clientY;

      // Use canvasRef to position the hover card relative to the canvas
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        // Check if mouse is within canvas boundaries
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          setMousePosition({ x: x + 80, y });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canvasRef]);

  if (industryQuery.isLoading)
    return (
      <div className="flex h-[350px] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
      </div>
    );

  return (
    <div
      ref={contentRef}
      className={`fixed z-50 border-[8px] border-[#22262f] bg-[#fff]`}
      style={{
        position: "fixed",
        top: mousePosition.y,
        left: mousePosition.x,
      }}
    >
      <h3 className="mb-2 text-lg font-bold">
        {parentHover?.sector} - {parentHover?.industry}
      </h3>
      {industryQuery.data?.length > 0 ? (
        <div className="">
          <div
            style={{
              backgroundColor: colorScale(
                industryQuery.data.find(
                  (item: StockData) =>
                    item.data.symbol === parentHover?.symbol,
                )?.data.change || 0,
              ),
            }}
            className={`flex flex-col justify-between gap-1 p-2 text-white`}
          >
            <div className="flex flex-row items-center justify-between gap-6">
              <p className="text-2xl font-extrabold">
                {parentHover?.symbol.toUpperCase()}
              </p>
              <LineChartSimple
                data={
                  industryQuery.data.find(
                    (item: StockData) =>
                      item.data.symbol === parentHover?.symbol,
                  )?.quote || []
                }
                lineWidth={2}
              />
              <p className="text-2xl font-extrabold">
                {industryQuery.data.find(
                  (item: StockData) => item.data.symbol === parentHover?.symbol,
                )?.data.last || 0}
              </p>
              <p className="text-2xl font-extrabold">
                {industryQuery.data.find(
                  (item: StockData) => item.data.symbol === parentHover?.symbol,
                )?.data.change || 0}
                %
              </p>
            </div>
            <p className="text-lg font-bold">Apple Inc. (AAPL)</p>
          </div>
          {industryQuery.data
            .slice(0, 5)
            .map((item: StockData, index: number) => (
              <div
                key={index}
                className="gap-x -6 flex flex-row items-center justify-between px-2 py-1"
              >
                <p className="text-lg font-bold">
                  {item.data.symbol.toUpperCase()}
                </p>
                <LineChartSimple data={item.quote} lineColor="#000" />
                <p className="text-lg font-bold">{item.data.last}</p>
                <p className="text-lg font-bold">{item.data.change}</p>
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders

export default IndustryHoverCard;
