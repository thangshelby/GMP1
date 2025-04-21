"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getScreener } from "@/apis/screener";
import { format, subYears } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { ReviewStockType } from "@/types";
import StockQuoteOverview from "../home/StockQuoteOverview";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import { useSearchParams, useRouter } from "next/navigation";

const ScreenerResult = ({
  sortedCategory
}: {
  sortedCategory: {
    orderBy: {title: string, value: string}
    sortBy: {title: string, value: string}
    signal: {title: string, value: string}
    searchSymbol: string
  }
}) => {
  console.log(sortedCategory)
  const today = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page")) || 1;
  
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["screener", today, page],
    queryFn: () => getScreener(today, page),
    refetchOnWindowFocus: false,
    retry: false,
  });

  const tableHeaders = [
    "STT",
    "Mã",
    "Công ty",
    "Ngành",
    "Nhóm Ngành", 
    "Quốc gia",
    "Vốn hóa thị trường",
    "Giá",
    "Biến động",
    "Khối lượng",
  ];

  const handlePageChange = (newPage: number) => {
    router.push(`/screener?page=${newPage}`);
  };

  return (
    <div className="flex flex-col justify-center gap-6 pb-12">
      <div className="border-secondary-3 relative z-20 w-full rounded-sm border-1">
        <Table className="border-none">
          <TableHeader className="border-b-0 border-none">
            <TableRow className="text-secondary h-6 border-b-0 text-xs font-extralight">
              {tableHeaders.map((header, index) => (
                <TableHead
                  key={index}
                  className={`text-secondary h-6 text-start ${index == 0 && "pr-0 text-end"}`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isSuccess &&
              data.data
                .slice(0, 20)
                .map((stock: ReviewStockType, index: number) => (
                  <StockTableRow
                    key={stock.symbol}
                    stock={stock}
                    id={index + 1 + (page - 1) * 20}
                  />
                ))}
            {isLoading &&
              Array.from({ length: 20 }, (_, index) => (
                <StockTableRowSkeleton key={index} />
              ))}
          </TableBody>
        </Table>
      </div>

      {isSuccess && (
        <Pagination>
          <PaginationContent>
            <PaginationItem
              className={`hover:cursor-pointer ${page == 1 && "opacity-50 hover:cursor-not-allowed"}`}
              onClick={() => {
                if (page > 1) {
                  handlePageChange(page - 1);
                }
              }}
            >
              <FaArrowLeftLong color={"#57aefb"} />
            </PaginationItem>
            {Array.from({ length: 5 }, (_, index) => {
              const pageNum = page <= 3 ? index + 1 : page + index - 2;
              return (
                <PaginationItem
                  key={index}
                  onClick={() => {
                    handlePageChange(pageNum);
                  }}
                  className={`${pageNum == page && "border-primary bg-button border-[1px]"} hover:bg-button rounded-sm p-0 px-2 hover:cursor-pointer group `}
                >
                  <Link
                    className={`${pageNum == page ? "text-white" : "text-primary"} text-xs group-hover:text-white `}
                    href={`/screener?page=${pageNum}`}
                  >
                    {pageNum}
                  </Link>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationEllipsis className="text-primary p-0" />
            </PaginationItem>

            <PaginationItem
              className={`${Math.floor(data.total_count / 20) + 1 == page && "border-primary bg-button border-[1px]"} hover:bg-button rounded-sm p-0 px-2 hover:cursor-pointer`}
            >
              <Link 
                className={`${Math.floor(data.total_count / 20) + 1 == page ? "text-white" : "text-primary"} text-xs hover:text-white`}
                href={`/screener?page=${Math.floor(data.total_count / 20) + 1}`}
              >
                {Math.floor(data.total_count / 20) + 1}
              </Link>
            </PaginationItem>
            <PaginationItem
              className={`hover:cursor-pointer ${page == Math.floor(data.total_count / 20) + 1 && "opacity-50 hover:cursor-not-allowed"}`}  
              onClick={() => {
                if (page < Math.floor(data.total_count / 20) + 1) {
                  handlePageChange(page + 1);
                }
              }}
            >
              <FaArrowRightLong color={"#57aefb"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const StockTableRow = ({
  stock,
  id,
}: {
  stock: ReviewStockType;
  id: number;
}) => {
  const [showPopup, setShowPopup] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent<HTMLTableCellElement>) => {
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
      className={`group border-b-0 text-xs hover:cursor-pointer hover:bg-[#353945] ${id % 2 == 0 && "bg-[#2c303b]"}`}
    >
      <TableCell className="h-2 p-0 text-end font-medium text-white hover:underline">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{id}</Link>
      </TableCell>
      <TableCell
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="text-primary group relative h-6 px-2 py-0 text-start font-medium hover:underline"
      >
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.symbol}</Link>

        {showPopup && (
          <StockQuoteOverview
            data={
              stock?.quote?.slice(
                stock?.quote.length - 60,
                stock?.quote.length,
              ) || []
            }
            position={position}
            infomation={{
              name: stock.name,
              symbol: stock.symbol,
              market_cap: stock.market_cap,
              industry: stock.industry,
            }}
          />
        )}
      </TableCell>
      <TableCell className="h-6 px-2 py-0 text-start font-semibold text-white">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.name}</Link>
      </TableCell>
      <TableCell className="h-6 px-2 py-0 text-start font-semibold text-white">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>
      {stock.sector}
        </Link>
      </TableCell>
      <TableCell className="h-6 px-2 py-0 text-start font-semibold text-white">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>
          {stock.industry}
        </Link>
      </TableCell>
      <TableCell className="h-6 px-2 py-0 text-start font-semibold text-white">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>Viet Nam</Link>
      </TableCell>

      <TableCell className="h-6 px-2 py-0 text-start font-semibold text-white">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>
          {stock.market_cap}
        </Link>
      </TableCell>

      <TableCell
        className={`${stock.change > 0 ? "text-green group-hover:text-[#81cf90]" : "text-red group-hover:opacity-130"} h-6 px-2 py-0 text-start`}
      >
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.last}</Link>
      </TableCell>
      <TableCell
        className={`${stock.change > 0 ? "text-green group-hover:text-[#81cf90]" : "text-red group-hover:opacity-130"} h-6 px-2 py-0 text-start`}
      >
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.change}%</Link>
      </TableCell>
      <TableCell className="h-6 px-2 py-0 text-start font-semibold text-white">
        <Link href={`/stockchart?symbol=${stock.symbol}`}>{stock.volume}</Link>
      </TableCell>
    </TableRow>
  );
};

const StockTableRowSkeleton = () => {
  return (
    <TableRow className="group border-b-0 text-xs hover:cursor-pointer hover:bg-[#353945]">
      {Array.from({ length: 10 }, (_, index) => (
        <TableCell
          key={index}
          className="text-primary px-2 py-[1px] text-start font-medium hover:underline"
        >
          <Skeleton className="h-4 w-16" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default ScreenerResult;
