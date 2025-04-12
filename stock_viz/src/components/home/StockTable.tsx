"use client";
import { ReviewStockType } from "@/types";
import Link from "next/link";
import { fetchAPI } from "@/lib/utils";
import { format, subYears } from "date-fns";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const StockTable = () => {
  const endDate = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const [data, setData] = React.useState<ReviewStockType[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `stocks/stocks_review?quantity=${10}&end_date=${endDate}`,
      );
      setData(response);
    };
    fetchData();
  }, []);

  return (
    <div className="border-secondary-3 w-full table-auto border-collapse rounded-sm border-1">
      <Table>
        <TableHeader className="border-b-0"> 
          <TableRow className="text-secondary text-xs font-extralight border-b-0  ">
            <TableHead className="text-secondary h-7 text-start">Symbol</TableHead>
            <TableHead className="text-secondary h-7 text-end">Last</TableHead>
            <TableHead className="text-secondary h-7 text-end">Change</TableHead>
            <TableHead className="text-secondary h-7 text-end">Volume</TableHead>
            <TableHead className="text-secondary h-7 pr-2 text-end">Signal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 18).map((stock) => (
            <TableRow
              key={stock.symbol}
              className="group text-xs hover:cursor-pointer hover:bg-[#353945] border-b-0"
            >
              <TableCell className="px-2 py-[1px] text-primary text-start font-medium hover:underline">
                <Link href={`/stockchart?symbol=${stock.symbol}`}>
                  {stock.symbol}
                </Link>
              </TableCell>
              <TableCell className="px-2 py-[1px] text-secondary text-end font-semibold">
                <Link href={`/stockchart?symbol=${stock.symbol}`}>
                  {stock.last}
                </Link>
              </TableCell>
              <td
                className={`${stock.change > 0 ? "text-green" : "text-red"} text-end group-hover:text-[#81cf90]`}
              >
                <Link href={`/stockchart?symbol=${stock.symbol}`}>
                  {stock.change}%
                </Link>
              </td>
              <TableCell className="px-2 py-[1px] text-secondary text-end font-semibold">
                <Link href={`/stockchart?symbol=${stock.symbol}`}>
                  {stock.volume}
                </Link>
              </TableCell>
              <TableCell className="px-2 py-[1px] text-primary text-end font-medium hover:underline">
                <Link href={`/stockchart?symbol=${stock.symbol}`}>
                  {stock.signal}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockTable;
