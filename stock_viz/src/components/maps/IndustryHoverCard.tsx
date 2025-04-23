import React, {
  useRef,
  useEffect,
  useState,
  RefObject,
  memo,
  useMemo,
} from "react";
import * as d3 from "d3";
import { useQuery } from "@tanstack/react-query";

import LineChartSimple from "./LineChartSimple";
import { getStocksQuote } from "@/apis/stock.api";
import { getColor as colorScale, formatNumber } from "@/lib/utils";

// Types
interface TreemapNode {
  name: string;
  value?: number;
  change?: number;
  children?: TreemapNode[];
}

interface IndustryHoverCardProps {
  treeData: d3.HierarchyRectangularNode<TreemapNode>;
  date: string;
  canvasRef: RefObject<HTMLCanvasElement>;
  symbol: d3.HierarchyRectangularNode<TreemapNode> | null;
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

interface SymbolHoverState {
  symbol: string;
  sector: string;
  industry: string;
  symbols: string[];
}

// Memoized components
const MemoizedLineChart = memo(LineChartSimple);

const IndustryHoverCard = ({
  date,
  canvasRef,
  symbol,
}: IndustryHoverCardProps) => {
  // State
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [symbolHover, setSymbolHover] = useState<SymbolHoverState | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Update symbol hover state when symbol changes
  useEffect(() => {
    if (!symbol) {
      setSymbolHover(null);
      return;
    }

    setSymbolHover({
      symbol: symbol.data.name,
      sector: symbol.parent?.parent?.data.name || "",
      industry: symbol.parent?.data.name || "",
      symbols: symbol.parent?.children?.map((child) => child.data.name) || [],
    });
  }, [symbol]);

  // Data fetching logic
  const shouldFetch = Boolean(symbolHover?.symbols.length);

  const industryQuery = useQuery({
    queryKey: [`industry_detail`, symbolHover?.industry, date],
    queryFn: () =>
      symbolHover ? getStocksQuote(symbolHover.symbols.join(","), date) : null,
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    staleTime: 40000,
  });

  const currentSymbolData = useMemo(() => {
    if (!industryQuery.data || !symbolHover) return null;

    return industryQuery.data.find(
      (item: StockData) => item.data.symbol === symbolHover.symbol,
    );
  }, [industryQuery.data, symbolHover]);

  // Mouse position tracking
  useEffect(() => {
    let lastTime = 0;
    const throttleTime = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleTime) return;
      lastTime = now;

      if (!canvasRef.current) return;

      const x = e.clientX;
      const y = e.clientY;
      const rect = canvasRef.current.getBoundingClientRect();

      // Check if mouse is over the canvas
      const isMouseOverCanvas =
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

      if (!isMouseOverCanvas) return;

      // Calculate position for the hover card
      const position = calculateHoverPosition(x, y);
      setMousePosition(position);
    };

    const calculateHoverPosition = (x: number, y: number) => {
      const position = { x: x + 80, y };
      const contentWidth = contentRef.current?.clientWidth || 0;
      const contentHeight = contentRef.current?.clientHeight || 0;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Adjust vertical position if it would go off-screen
      if (contentHeight > windowHeight - y) {
        position.y = windowHeight - contentHeight;
      }

      // Adjust horizontal position if it would go off-screen
      if (x > windowWidth * 0.6) {
        position.x = x - 160 - contentWidth;
      }

      return position;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canvasRef]);

  // Early returns
  if (!symbolHover) return null;
  if (industryQuery.isLoading)
    return <div className="fixed z-50" style={{ opacity: 0 }}></div>;

  // Render component
  return (
    <div
      ref={contentRef}
      className="fixed z-50 border-[8px] border-[#22262f] bg-[#fff]"
      style={{
        opacity: symbolHover ? "1" : "0",
        visibility: symbolHover ? "visible" : "hidden",
        position: "fixed",
        top: mousePosition.y || 0,
        left: mousePosition.x || 0,
      }}
    >
      <h3 className="mb-2 text-lg font-bold">
        {symbolHover.sector} - {symbolHover.industry}
      </h3>

      {industryQuery.data?.length > 0 && currentSymbolData ? (
        <div>
          <StockRow item={currentSymbolData} isSpecial={true} />
          {industryQuery.data
            .slice(0, 10)
            .map((item: StockData, index: number) => (
              <StockRow key={index} item={item} />
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default memo(IndustryHoverCard);

const StockRow = memo(
  ({ item, isSpecial = false }: { item: StockData; isSpecial?: boolean }) => (
    <div
      style={{
        backgroundColor: isSpecial
          ? colorScale(item.data.change || 0)
          : "transparent",
      }}
      className="flex flex-row items-center justify-between gap-6 p-2"
    >
      <p
        className={`text-${isSpecial ? "2xl" : "lg"} font-${isSpecial ? "extrabold" : "bold"} ${isSpecial ? "text-white" : ""}`}
      >
        {item.data.symbol.toUpperCase()}
      </p>
      <MemoizedLineChart
        data={item.quote}
        lineColor={isSpecial ? "#fff" : "#000"}
        lineWidth={isSpecial ? 2 : 1}
      />
      <p
        className={`text-${isSpecial ? "2xl" : "lg"} font-${isSpecial ? "extrabold" : "bold"} ${isSpecial ? "text-white" : ""}`}
      >
        {formatNumber(item.data.market_cap * 1000)}
      </p>
      <p
        className={`text-${isSpecial ? "2xl" : "lg"} font-${isSpecial ? "extrabold" : "bold"} ${isSpecial ? "text-white" : ""}`}
      >
        {item.data.change}%
      </p>
    </div>
  ),
);
StockRow.displayName = "StockRow";
