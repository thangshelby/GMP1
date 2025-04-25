"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { subYears, format } from "date-fns";
import { getSymbolReview } from "@/apis/market.api";
import { ReviewStockType } from "@/types";
import { debounce } from "lodash";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const MapsSideBar = () => {
  const date = format(subYears(new Date(), 1), "yyyy-MM-dd");

  const exchangeFilterCategories = [
    {
      title: "Top 500 VN",
      value: "top_500",
    },
    {
      title: "All",
      value: "all",
    },
    {
      title: "HOSE Exchange",
      value: "hose",
    },
    {
      title: "HNX Exchange",
      value: "hnx",
    },
  ];

  const timeFrameFiltersCategories = [
    {
      title: "1-Day Performance",
      value: "1D",
    },
    {
      title: "1-Week Performance",
      value: "1W",
    },
    {
      title: "1-Month Performance",
      value: "1M",
    },
    {
      title: "3-Month Performance",
      value: "3M",
    },
    {
      title: "6-Month Performance",
      value: "6M",
    },
    {
      title: "1-Year Performance",
      value: "1Y",
    },
  ];

  const [selectedFilter, setSelectedFilter] = useState({
    exchange: exchangeFilterCategories[0].value,
    timeframe: timeFrameFiltersCategories[0].value,
  });

  const router = useRouter();

  useEffect(() => {
    router.push(
      `/maps?exchange=${selectedFilter.exchange}&timeframe=${selectedFilter.timeframe}`,
    );
  }, [selectedFilter.exchange, router, selectedFilter.timeframe]);

  const [searchSymbol, setSearchSymbol] = useState("");
  const [searchSymbolMatched, setSearchSymbolMatched] = useState<
    ReviewStockType[]
  >([]);

  const result = useQuery({
    queryKey: [`symbols/symbols_review`, selectedFilter.exchange],
    queryFn: () => getSymbolReview(date, selectedFilter.exchange),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!result.isSuccess) return;

    const debouncedSearch = debounce(() => {
      const matchedSymbols = result.data
        .filter((symbol: ReviewStockType) => {
          return (
            symbol.symbol.includes(searchSymbol) ||
            symbol.name.includes(searchSymbol)
          );
        })
        .sort((a: ReviewStockType, b: ReviewStockType) =>
          a.symbol.localeCompare(b.symbol),
        );

      setSearchSymbolMatched(matchedSymbols);
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [result.data, result.isSuccess, searchSymbol]);

  const handleSearchSymbol = (inputValue: string) => {
    setSearchSymbol(inputValue.toUpperCase());
  };

  return (
    <div className="flex w-full flex-col gap-1">
      {/* Map Filter Section */}
      <div className="flex w-full flex-col items-start bg-[#404553] p-4">
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-secondary text-sm">MAP FILTER</h2>
          <div className="">
            {exchangeFilterCategories.map((filter, index: number) => (
              <div
                key={filter.value}
                className={`cursor-pointer py-2 text-sm font-medium ${
                  selectedFilter.exchange === filter.value
                    ? "text-primary font-bold"
                    : "text-white"
                } ${index < exchangeFilterCategories.length - 1 && "border-b-[1px] border-gray-800"} hover:text-primary hover:cursor-pointer`}
                onClick={() =>
                  setSelectedFilter({
                    ...selectedFilter,
                    exchange: filter.value,
                  })
                }
              >
                {filter.title}
              </div>
            ))}
          </div>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full cursor-pointer items-center justify-between bg-gray-700 px-2 py-1 text-sm text-white outline-none">
              <span>{timeFrameFiltersCategories.find(filter => filter.value === selectedFilter.timeframe)?.title}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full rounded-none border-0 bg-gray-700 px-4 py-2 text-white">
              {timeFrameFiltersCategories.map((filter) => (
                <DropdownMenuItem
                  key={filter.value}
                  onClick={() => {
                    setSelectedFilter({
                      ...selectedFilter,
                      timeframe: filter.value,
                    });
                  }}
                  className={`cursor-pointer rounded-none text-white hover:bg-gray-800 ${selectedFilter.timeframe === filter.value && "bg-primary"} `}
                >
                  {filter.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="bg-[#363a46] p-2">
        {/* Search Section */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Quick search ticker"
            value={searchSymbol}
            onChange={(e) => {
              handleSearchSymbol(e.target.value);
            }}
            className="z-10 w-full rounded bg-gray-700 px-8 py-2 text-xs text-gray-200 outline-none"
          />
          <span className="absolute top-0 left-0 flex h-full w-full items-center pl-2">
            <div className="text-secondary-2 z-20">
              <HiMiniMagnifyingGlass />
            </div>
          </span>
        </div>

        {/* Stock List */}
        <div className="gap-2 px-4">
          {searchSymbolMatched
            .slice(0, 10)
            .map((stock: ReviewStockType, index: number) => (
              <div
                key={stock.symbol}
                className={`flex cursor-pointer items-center space-x-2 py-1 hover:bg-gray-700 ${index < 9 && "border-b-[1px] border-gray-900"} `}
              >
                <span className="text-2xs text-secondary w-[20%] text-center font-bold">
                  {stock.symbol}
                </span>
                <span className="text-2xs text-secondary-3 w-[80%] truncate text-left font-semibold">
                  {stock.name}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MapsSideBar;
