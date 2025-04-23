"use client";
import React, { useState } from "react";

const MapsSideBar = () => {
  const [selectedFilter, setSelectedFilter] = useState("S&P 500");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("1-Day Performance");

  const mapFilters = ["S&P 500", "World", "Full", "Exchange Traded Funds"];

  const stockExamples = [
    { symbol: "A", name: "Agilent Technologies Inc" },
    { symbol: "AAPL", name: "Apple Inc" },
    { symbol: "ABBV", name: "Abbvie Inc" },
    { symbol: "ABNB", name: "Airbnb Inc" },
    { symbol: "ABT", name: "Abbott Laboratories" },
    { symbol: "ACGL", name: "Arch Capital Group Ltd" },
    { symbol: "ACN", name: "Accenture plc" },
    { symbol: "ADBE", name: "Adobe Inc" },
  ];

  return (
    <div className="flex w-full flex-col gap-1">
      {/* Map Filter Section */}
      <div className="flex flex-col items-start bg-[#404553] p-4">
        <div>
          <h2 className="text-sm text-gray-400">MAP FILTER</h2>
          <div className="gap-1">
            {mapFilters.map((filter) => (
              <div
                key={filter}
                className={`cursor-pointer ${
                  selectedFilter === filter ? "text-blue-400" : "text-gray-200"
                }`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </div>
            ))}
          </div>
        </div>

        {/* Timeframe Dropdown */}
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full cursor-pointer appearance-none rounded bg-gray-700 px-2 py-1 text-gray-200 text-xs"
          >
            <option>1-Day Performance</option>
            {/* Add more timeframe options as needed */}
          </select>
        </div>
      </div>

      <div className="bg-[#363a46] p-2">
        {/* Search Section */}
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Quick search ticker"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded bg-gray-700 px-8 py-2 text-xs text-gray-200"
          />
          <span className="absolute top-2.5 left-2">🔍</span>
        </div>

        {/* Stock List */}
        <div className="gap-2 px-2">
          {stockExamples
            .filter(
              (stock) =>
                stock.symbol
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((stock, index) => (
              <div
                key={stock.symbol}
                className={`flex cursor-pointer items-center space-x-2 p-1 hover:bg-gray-700 ${index != stockExamples.length - 1 && "border-b-[1px] border-black"} `}
              >
                <span className="text-2xs w-[20%] text-center font-bold text-secondary">
                  {stock.symbol}
                </span>
                <span className="text-2xs w-[80%] text-left font-semibold text-secondary-3">
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
