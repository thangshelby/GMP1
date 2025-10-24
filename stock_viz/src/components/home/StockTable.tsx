"use client";
import { ReviewStockType } from "@/types";
import Link from "next/link";
import { format, subYears } from "date-fns";
import { useState, MouseEvent } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { getSymbolReview } from "@/apis/market.api";
import { Skeleton } from "../ui/skeleton";
import StockQuoteOverview from "./StockQuoteOverview";

const StockTable = ({ exchange }: { exchange: string }) => {
  const date = format(subYears(new Date(), 1), "yyyy-MM-dd");

  const result = useQuery({
    queryKey: ["symbols/symbols_review", exchange],
    queryFn: () => getSymbolReview(date, exchange),
    refetchOnWindowFocus: false,
  });
  return (
    <div className="border-secondary-3 relative z-20 w-full rounded-sm border">
      <Table className="">
        <TableHeader className="border-b-0">
          <TableRow className="text-secondary border-b-0 text-xs font-extralight">
            <TableHead className="text-secondary h-7 text-start">
              Symbol
            </TableHead>
            <TableHead className="text-secondary h-7 text-end">Last</TableHead>
            <TableHead className="text-secondary h-7 text-end">
              Change
            </TableHead>
            <TableHead className="text-secondary h-7 text-end">
              Volume
            </TableHead>
            <TableHead className="text-secondary h-7 pr-2 text-end">
              Signal
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {result.isSuccess &&
            result.data
              .slice(0, 22)
              .map((stock: ReviewStockType) => (
                <StockTableRow key={stock.symbol} {...stock} />
              ))}
          {result.isLoading &&
            Array.from({ length: 22 }, (_, index) => (
              <StockTableRowSkeleton key={index} />
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

const StockTableRowSkeleton = () => {
  return (
    <TableRow className="group hover:bg-button border-b-0 text-xs hover:cursor-pointer">
      <TableCell className="text-primary px-2 py-[1px] text-start font-medium hover:underline">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-secondary px-2 py-[1px] text-end font-semibold">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <td className="text-end group-hover:text-[#81cf90]">
        <Skeleton className="h-4 w-16" />
      </td>
      <TableCell className="text-secondary px-2 py-[1px] text-end font-semibold">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-primary px-2 py-[1px] text-end font-medium hover:underline">
        <Skeleton className="h-4 w-16" />
      </TableCell>
    </TableRow>
  );
};

const StockTableRow = (stock: ReviewStockType) => {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: MouseEvent<HTMLTableCellElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.top - 140 + window.scrollY, // thêm scroll nếu có
      left: rect.left + 200,
    });
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  return (
    <TableRow
      key={stock.symbol}
      className="group border-b-0 text-xs hover:cursor-pointer hover:bg-[#353945]"
    >
      <TableCell
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-primary group relative px-2 py-[1px] text-start font-medium hover:underline"
      >
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.symbol}</Link>

        {showPopup && (
          <StockQuoteOverview position={position} infomation={stock} />
        )}
      </TableCell>

      <TableCell className="text-secondary px-2 py-[1px] text-end font-semibold">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.last}</Link>
      </TableCell>
      <td
        className={`${stock.change > 0 ? "text-green group-hover:text-[#81cf90]" : "text-red group-hover:opacity-130"} text-end`}
      >
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.change}%</Link>
      </td>
      <TableCell className="text-secondary px-2 py-[1px] text-end font-semibold">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.volume}</Link>
      </TableCell>
      <TableCell className="text-primary px-2 py-[1px] text-end font-medium hover:underline">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.signal}</Link>
      </TableCell>
    </TableRow>
  );
};

export default StockTable;
