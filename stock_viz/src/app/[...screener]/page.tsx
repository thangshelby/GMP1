"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import {
  MdOutlineArrowDropDown,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import ScreenerResult from "@/components/screener/ScreenerResult";
import { useTranslations } from "@/hooks/useTranslations";

const Screener = () => {
  const { tScreener } = useTranslations();
  const [sortedCategory, setSortedCategory] = useState<{
    orderBy: { title: string; value: string };
    sortBy: { title: string; value: string };
    signal: { title: string; value: string };
    // searchSymbol:string,
  }>({
    orderBy: filterHeaders[0].items[0],
    sortBy: filterHeaders[1].items[0],
    signal: filterHeaders[2].items[0],
    // searchSymbol: "",
  });
  const [selectedCategory, setSelectedCategory] = useState(
    filterCategories[0].title,
  );

  return (
    <div className="flex flex-col gap-6 px-12">
      <div className="border-secondary flex flex-col gap-4 rounded-md border-x-[1px] border-b-[1px] p-2">
        <div className="flex flex-row justify-between">
          {filterHeaders.map((header) => (
            <div
              key={header.key}
              className="mr-2 flex flex-row items-center gap-2"
            >
              <p className="text-secondary text-xs font-medium">
                {tScreener(`screener.filterHeaders.${header.key}`)}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger className="border-secondary rounded-sm border-1 p-1 hover:cursor-pointer">
                  <div className="flex w-32 flex-row justify-between">
                    <span className="text-xs text-white">
                      {tScreener(`screener.${header.key}Options.${sortedCategory[header.key as keyof typeof sortedCategory].value}`)}
                    </span>
                    <MdOutlineArrowDropDown color="#868ea5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className={`border-secondary max-h-60 rounded-none border-1 bg-[#22262f]`}
                >
                  {header.items.map((item, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() =>
                        setSortedCategory({
                          ...sortedCategory,
                          [header.key]: item,
                        })
                      }
                      className={`text-xs font-medium text-white hover:cursor-pointer ${sortedCategory[header.key as keyof typeof sortedCategory].title == item.title ? "bg-primary border-[0px]" : ""}`}
                    >
                      {tScreener(`screener.${header.key}Options.${item.value}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          <div className="mr-2 flex flex-row items-center gap-2">
            <p className="text-secondary text-xs">{tScreener('screener.searchSymbol')}</p>
            <input
              className="border-secondary text-secondary rounded-sm border-1 p-1 text-xs outline-none hover:cursor-pointer"
              type="text"
            />
            <div className="border-secondary bg-button flex items-center justify-center rounded-sm border-1 p-1 hover:cursor-pointer">
              <MdOutlineKeyboardArrowRight color="#868ea5" />
            </div>
          </div>

          <div className="flex flex-row items-center gap-1 rounded-sm bg-[#4c5263] px-2 hover:cursor-pointer">
            <span className="text-secondary text-xs font-semibold">
              {tScreener('screener.filters')}
            </span>

            <MdOutlineKeyboardArrowUp color="#868ea5" />
          </div>
        </div>

        <div className="flex flex-row items-center">
          <div className="border-secondary flex-1 border-t-[1px]" />
          <div className="flex flex-row items-center overflow-hidden">
            {filterCategories.map((category, index) => (
              <div
                onClick={() => setSelectedCategory(category.title)}
                key={category.title}
                className={`border-secondary border-[0.5px] ${category.title == selectedCategory ? "border-primary border-[1px] bg-[#263766] text-white" : "text-secondary bg-[#14161d]"} px-2 py-[2px] text-xs font-semibold ${index == 0 && "rounded-l-md"} ${index == filterCategories.length - 1 && "rounded-r-md"} hover:cursor-pointer hover:text-white`}
              >
                {tScreener(`screener.filterCategories.${category.title.toLowerCase()}`)}
              </div>
            ))}
          </div>
          <div className="border-secondary flex-1 border-t-[1px]" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {filterCategories[0].items!.map((item) => (
            <div
              key={item.title}
              className="flex flex-row items-center justify-end gap-2"
            >
              <span className="text-secondary text-xs font-medium">
                {tScreener(`screener.descriptiveFilters.${'key' in item && item.key}`)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="border-secondary rounded-sm border-1 p-1 hover:cursor-pointer hover:border-white">
                  <div className="flex w-32 flex-row justify-between">
                    <span className="text-xs text-white">{tScreener('screener.any')}</span>
                    <MdOutlineArrowDropDown color="#868ea5" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-secondary max-h-60 rounded-none border-1 bg-[#22262f]">
                  {Array.isArray(item.value) &&
                    [tScreener('screener.any'), ...item.value].map((val, index) => (
                      <DropdownMenuItem
                        key={index}
                        className="text-xs font-medium text-white hover:cursor-pointer"
                      >
                        {val}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>

      <ScreenerResult sortedCategory={sortedCategory} />
    </div>
  );
};

export default Screener;

const filterHeaders = [
  {
    title: "Order by",
    key: "orderBy",
    items: [
      { title: "Ticker", value: "ticker" },
      { title: "Name", value: "name" },
      { title: "Exchange", value: "exchange" },
      { title: "Industry", value: "industry" },
      { title: "Market Cap.", value: "marketCap" },
    ],
  },
  {
    title: "Sort by",
    key: "sortBy",
    items: [
      { title: "Ascending", value: "ascending" },
      { title: "Descending", value: "descending" },
    ],
  },
  {
    title: "Signal",
    key: "signal",
    items: [
      { title: "All", value: "all" },
      { title: "None", value: "none" },
      { title: "Buy", value: "buy" },
      { title: "Sell", value: "sell" },
      { title: "Hold", value: "hold" },
    ],
  },
];

const filterCategories = [
  {
    title: "Descriptive",
    items: [
      { title: "Exchange", value: ["HOSE", "HNX", "UPCOM"] },
      {
        title: "Index",
        key: "index",
        value: [
          "VN30",
          "VN100",
          "VNMidCap",
          "VNSmallCap",
          "VNAllShare",
          "ETF",
          "HNX30",
          "HNXCon",
          "HNXFin",
          "HNXMan",
          "HNXLCap",
          "FU_INDEX",
        ],
      },
      {
        title: "Market Cap.",
        key: "marketCap",
        value: [
          "Dưới 500 tỷ",
          "500 - 1,000 tỷ",
          "1,000 - 5,000 tỷ",
          "5,000 - 10,000 tỷ",
          "Trên 10,000 tỷ",
        ],
      },
      {
        title: "Industry",
        key: "industry",
        value: [
          "Hóa chất",
          "Thực phẩm và đồ uống",
          "Hàng cá nhân & Gia dụng",
          "Hàng & Dịch vụ Công nghiệp",
          "Ngân hàng",
          "Xây dựng và Vật liệu",
          "Tài nguyên Cơ bản",
          "Truyền thông",
          "Bất động sản",
          "Dịch vụ tài chính",
          "Điện, nước & xăng dầu khí đốt",
          "Bán lẻ",
          "Bảo hiểm",
          "Dầu khí",
          "Công nghệ Thông tin",
          "Ô tô và phụ tùng",
          "Du lịch và Giải trí",
          "Y tế",
        ],
      },
      {
        title: "Sector",
        key: "sector",
        value: [
          "Công nghiệp",
          "Tài chính",
          "Tiêu dùng không thiết yếu",
          "Tiêu dùng thiết yếu",
          "Năng lượng",
          "Vật liệu",
          "Bất động sản",
          "Tiện ích",
          "Truyền thông",
          "Công nghệ",
          "Y tế",
        ],
      },
      {
        title: "Price",
        key: "price",
        value: [
          "Dưới 10,000đ",
          "10,000đ - 30,000đ",
          "30,000đ - 70,000đ",
          "Trên 70,000đ",
        ],
      },
      {
        title: "Average Volume",
        key: "averageVolume",
        value: ["Dưới 100K", "100K - 500K", "500K - 1M", "Trên 1M"],
      },
      {
        title: "Current Volume",
        key: "currentVolume",
        value: ["Dưới 100K", "100K - 500K", "500K - 1M", "Trên 1M"],
      },
      {
        title: "Share outstanding",
        key: "shareOutstanding",
        value: [
          "Dưới 842 M",
          "842 - 1,677 M",
            "1,677 - 2,512 M",
            "2,512 - 3,347 M",
          "3,347 - 4,182 M",
          "4,182 - 5,017 M",
          "5,017 - 5,852 M",
          "5,852 - 6,687 M",
          "6,687 - 7,522 M",
          "Trên 7,522 M",
        ],
      },
      {
        title: "Relative Volume",
        key: "relativeVolume",
        value: ["< 0.5", "0.5 - 1.0", "1.0 - 2.0", "> 2.0"],
      },
      {
        title: "Analysts Recom.",
        key: "analystsRecom",
        value: ["Mua mạnh", "Mua", "Giữ", "Bán", "Bán mạnh"],
      },
      {
        title: "Dividend Yield",
        key: "dividendYield",
        value: ["Không cổ tức", "Dưới 2%", "2% - 5%", "5% - 8%", "Trên 8%"],
      },
    ],
  },
  {
    title: "Fundamental",
  },
  {
    title: "Technical",
    items: [
      { title: "RSI", value: "rsi" },
      { title: "MACD", value: "macd" },
      { title: "Bollinger Bands", value: "bollinger_bands" },
      { title: "SMA", value: "sma" },
      { title: "EMA", value: "ema" },
    ],
  },
  {
    title: "ETF",
  },
  {
    title: "All",
  },
];
