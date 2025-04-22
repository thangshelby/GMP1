import React, {
  useRef,
  useEffect,
  useState,
  RefObject,
  memo,
  useMemo,
} from "react";
import LineChartSimple from "./LineChartSimple";
import { getColor as colorScale } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getStocksQuote } from "@/apis/stock.api";
import { formatNumber } from "@/lib/utils";
import * as d3 from "d3";
interface TreemapNode {
  name: string;
  value: number;
  change: number;
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
const MemoizedLineChart = memo(LineChartSimple);

// Memoized stock row component
const StockRow = memo(({ item }: { item: StockData }) => (
  <div className="flex flex-row items-center justify-between px-2 py-1">
    <p className="text-lg font-bold">{item.data.symbol.toUpperCase()}</p>
    <MemoizedLineChart data={item.quote} lineColor="#000" />
    <p className="text-lg font-bold">{formatNumber(item.data.last * 1000)}</p>
    <p className="text-lg font-bold">{item.data.change}</p>
  </div>
));
StockRow.displayName = "StockRow";

const IndustryHoverCard = ({ date, canvasRef ,symbol}: IndustryHoverCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const [symbolHover, setSymbolHover] = useState<{
    symbol: string;
    sector: string;
    industry: string;
    symbols: string[];
  } | null>(null);
  useEffect(() => {
    if (!symbol) return 
    setSymbolHover({
      symbol: symbol.data.name,
      sector: symbol.parent?.data.name || "",
      industry: symbol.parent?.parent?.data.name || "",
      symbols: symbol.parent?.children?.map((child) => child.data.name) || [],
    });
    console.log(symbol.parent?.children?.map((child) => child.data.name))
  }, [symbol]);

  // Don't fetch data if there's no hover or symbols
  const shouldFetch = !!symbolHover && symbolHover.symbols.length > 0;

  const industryQuery = useQuery({
    queryKey: [`industry_detail`, symbolHover?.industry, date],
    queryFn: () =>
      symbolHover ? getStocksQuote(symbolHover.symbols.join(","), date) : null,
    enabled: shouldFetch,
    refetchOnWindowFocus: false,
    staleTime: 40000, // Cache data for 30 seconds
  });

  const currentSymbolData = useMemo(() => {
    if (!industryQuery.data || !symbolHover) return null;
    return industryQuery.data.find(
      (item: StockData) => item.data.symbol === symbolHover.symbol,
    );
  }, [industryQuery.data, symbolHover]);

  useEffect(() => {
    // Throttled mouse move handler
    let lastTime = 0;
    const throttleTime = 16; // ~60fps

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleTime) return;
      lastTime = now;

      const x = e.clientX,
        y = e.clientY;
      const validCordinate = { x: x + 80, y: y };

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          const contentWidth = contentRef.current?.clientWidth || 0;
          const contentHeight = contentRef.current?.clientHeight || 0;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;

          if (contentHeight > windowHeight - y) {
            validCordinate.y = windowHeight - contentHeight;
          }
          if (x > windowWidth * 0.6) {
            validCordinate.x = x - 160 - contentWidth;
          }

          setMousePosition(validCordinate);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [canvasRef]);

  // Don't render anything if not hovering or loading
  if (!symbolHover) return null;

  if (industryQuery.isLoading)
    return <div className="fixed z-50" style={{ opacity: 0 }}></div>;

  return (
    <div
      ref={contentRef}
      className={`fixed z-50 border-[8px] border-[#22262f] bg-[#fff]`}
      style={{
        opacity: symbolHover ? "1" : "0",
        visibility: symbolHover ? "visible" : "hidden",
        position: "fixed",
        top: mousePosition?.y || 0,
        left: mousePosition?.x || 0,
      }}
    >
      <h3 className="mb-2 text-lg font-bold">
        {symbolHover.sector} - {symbolHover.industry}
      </h3>
      {industryQuery.data?.length > 0 && currentSymbolData ? (
        <div>
          <div
            style={{
              backgroundColor: colorScale(currentSymbolData.data.change || 0),
            }}
            className={`flex flex-col justify-between gap-1 p-2 text-white`}
          >
            <div className="flex flex-row items-center justify-between gap-6">
              <p className="text-2xl font-extrabold">
                {symbolHover.symbol.toUpperCase()}
              </p>
              <MemoizedLineChart
                data={currentSymbolData.quote || []}
                lineWidth={2}
              />
              <p className="text-2xl font-extrabold">
                {formatNumber(currentSymbolData.data.last * 1000) || 0}
              </p>
              <p className="text-2xl font-extrabold">
                {currentSymbolData.data.change || 0}%
              </p>
            </div>
            <p className="text-lg font-bold">
              {currentSymbolData.data.name || symbolHover.symbol}
            </p>
          </div>

          {/* Only render first 5 items for better performance */}
          {industryQuery.data
            .slice(0, 5)
            .map((item: StockData, index: number) => (
              <StockRow key={index} item={item} />
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default memo(IndustryHoverCard);
