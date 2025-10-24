"use client";

import React, { Suspense } from "react";
import FinancialReportTable from "./FinancialReportTable";
import FinancialReportSkeleton from "./FinancialReportSkeleton";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFinancialReport } from "@/apis/report";

const FinancialReport = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(
    financialReportCategories[0].key,
  );
  const [selectedFilter, setSelectedFilter] = React.useState<{
    data: number[];
    timeFrame: number;
  }>({ data: [], timeFrame: 0 });

  const symbol = useSearchParams().get("symbol") || "VCB";

  const results = useQuery({
    queryKey: ["financial_report", symbol, selectedCategory, selectedFilter],
    queryFn: () =>
      getFinancialReport(
        symbol,
        selectedFilter.timeFrame === 0 ? "year" : "quarter",
      ),
    placeholderData: (previousData) => previousData, // Giữ data cũ khi fetch data mới
  });

  // Hiển thị skeleton khi đang loading lần đầu
  if (results.isLoading && !results.data) {
    return <FinancialReportSkeleton />;
  }

  // Hiển thị skeleton khi đang loading data mới (nhưng vẫn có data cũ)
  if (results.isFetching && results.data) {
    return (
      <div className="flex w-full flex-col gap-y-2 bg-[#22262f]">
        <div className="flex w-full flex-row items-center justify-between">
          {/* CATEGORY */}
          <div className="flex flex-row items-center justify-start space-x-4">
            {financialReportCategories.map((category, index) => (
              <div
                key={index}
                className={`text-primary text-[11px] hover:cursor-pointer hover:underline xl:text-base 2xl:text-lg ${selectedCategory === category.key ? "font-bold" : "font-normal"}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.title}
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-row items-center justify-start">
              <p className="text-secondary text-[11px] lg:text-base 2xl:text-lg">
                {financialReportFilters[0].title}
              </p>
              {financialReportFilters[0].items
                .slice(0, selectedFilter.timeFrame == 0 ? 2 : 4)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`text-secondary ml-1 text-[11px] hover:cursor-pointer hover:underline ${selectedFilter.data.includes(index) ? "border-primary bg-button border font-bold text-white" : "font-normal"} hover:bg-button rounded-sm px-2 py-[2px]`}
                    onClick={() => {
                      if (selectedFilter.data.includes(index)) {
                        setSelectedFilter({
                          ...selectedFilter,
                          data: selectedFilter.data.filter(
                            (item) => item !== index,
                          ),
                        });
                      } else {
                        setSelectedFilter({
                          ...selectedFilter,
                          data: [...selectedFilter.data, index],
                        });
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>

            <div className="flex flex-row items-center justify-start">
              <p className="text-secondary text-[11px] lg:text-base 2xl:text-lg">
                {financialReportFilters[1].title}
              </p>
              {financialReportFilters[1].items.map((item, index) => (
                <div
                  key={index}
                  className={`text-secondary ml-1 text-[11px] hover:cursor-pointer hover:underline ${selectedFilter.timeFrame === index ? "border-primary bg-button border font-bold text-white" : "font-normal"} hover:bg-button rounded-sm px-2 py-[2px]`}
                  onClick={() =>
                    setSelectedFilter({ ...selectedFilter, timeFrame: index })
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiển thị data cũ với overlay loading */}
        <div className="relative">
          <FinancialReportTable
            selectedCategory={selectedCategory}
            selectedFilter={selectedFilter}
            data={results.data[selectedCategory as keyof typeof results.data]}
            specialProperties={
              financialReportCategories.find(
                (item) => item.key === selectedCategory,
              )?.specialProperties || []
            }
          />
          {/* Loading overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#22262f]/50">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
              <span className="text-sm text-white">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    results.data && (
      <div className="flex w-full flex-col gap-y-2 bg-[#22262f]">
        <div className="flex w-full flex-row items-center justify-between">
          {/* CATEGORY */}
          <div className="flex flex-row items-center justify-start space-x-4">
            {financialReportCategories.map((category, index) => (
              <div
                key={index}
                className={`text-primary text-[11px] hover:cursor-pointer hover:underline ${selectedCategory === category.key ? "font-bold" : "font-normal"}`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.title}
              </div>
            ))}
          </div>

          {/* FILTERS */}
          <div className="flex flex-row items-center space-x-4">
            <div className="text-secondary flex flex-row items-center justify-start text-[11px]">
              {financialReportFilters[0].title}
              {financialReportFilters[0].items
                .slice(0, selectedFilter.timeFrame == 0 ? 2 : 4)
                .map((item, index) => (
                  <div
                    key={index}
                    className={`text-secondary ml-1 text-[11px] hover:cursor-pointer hover:underline ${selectedFilter.data.includes(index) ? "border-primary bg-button border font-bold text-white" : "font-normal"} hover:bg-button rounded-sm px-2 py-[2px]`}
                    onClick={() => {
                      if (selectedFilter.data.includes(index)) {
                        setSelectedFilter({
                          ...selectedFilter,
                          data: selectedFilter.data.filter(
                            (item) => item !== index,
                          ),
                        });
                      } else {
                        setSelectedFilter({
                          ...selectedFilter,
                          data: [...selectedFilter.data, index],
                        });
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
            </div>

            <div className="text-secondary flex flex-row items-center justify-start text-[11px]">
              {financialReportFilters[1].title}
              {financialReportFilters[1].items.map((item, index) => (
                <div
                  key={index}
                  className={`text-secondary ml-1 text-[11px] hover:cursor-pointer hover:underline ${selectedFilter.timeFrame === index ? "border-primary bg-button border font-bold text-white" : "font-normal"} hover:bg-button rounded-sm px-2 py-[2px]`}
                  onClick={() =>
                    setSelectedFilter({ ...selectedFilter, timeFrame: index })
                  }
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Suspense fallback={<div className="h-full w-full">Loading...</div>}>
          <FinancialReportTable
            selectedCategory={selectedCategory}
            selectedFilter={selectedFilter}
            data={results.data[selectedCategory as keyof typeof results.data]}
            specialProperties={
              financialReportCategories.find(
                (item) => item.key === selectedCategory,
              )?.specialProperties || []
            }
          />
        </Suspense>
      </div>
    )
  );
};

const balanceSheetSpecial = [
  "LIABILITIES (Bn. VND)",
  "Other long-term assets (Bn. VND)",
  "TOTAL ASSETS (Bn. VND)",
];
const income_statementSpecial = [
  "Revenue (Bn. VND)",
  "Total operating revenue",
  "Net Interest Income",
  // "Business income tax - current",
  "Profit before tax",
];
const cashflow_statementSpecial = [
  "Cash and cash equivalents",
  // "Cash flows from financial activities",
  "Net Cash Flows from Investing Activities",
  "Purchase of fixed assets",
  "Net increase/decrease in cash and cash equivalents",
];
const financialReportCategories = [
  {
    title: "Income Statement",
    key: "income_statement",
    specialProperties: income_statementSpecial,
  },
  {
    title: "Balance Sheet",
    key: "balance_sheet",
    specialProperties: balanceSheetSpecial,
  },
  {
    title: "Cash Flow",
    key: "cash_flow",
    specialProperties: cashflow_statementSpecial,
  },
];

const financialReportFilters = [
  {
    title: "Data",
    items: ["YoYGrowth", "YoYGrowth %", "QoQGrowth", "QoQGrowth %"],
  },
  {
    title: "Time Frame",
    items: ["Annual", "Quarterly"],
  },
];

export default FinancialReport;
