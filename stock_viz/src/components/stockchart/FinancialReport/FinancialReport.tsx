"use client";

import React, { Suspense } from "react";
import FinancialReportTable from "./FinancialReportTable";
import { fetchAPI } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

const FinancialReport = () => {
  const [selectedCategory, setSelectedCategory] = React.useState(
    financialReportCategories[0].key,
  );
  const [selectedFilter, setSelectedFilter] = React.useState<{
    data: number;
    timeFrame: number;
  }>({ data: 0, timeFrame: 0 });
  const [data, setData] = React.useState<any>();

  const symbol = useSearchParams().get("symbol") || "VCB";

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `/reports/financial_report?symbol=${symbol}&period=year`,
        {
          method: "GET",
        },
      );

      setData(response);
    };
    fetchData();
  }, []);

  return (
    data && (
      <div className="flex w-full flex-col gap-y-2 bg-[#22262f]">
        <div className="flex w-full flex-row items-center justify-between">
          {/* CATEGORY */}
          <div className="flex flex-row items-center justify-start space-x-1">
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
                    className={`text-secondary ml-1 text-[11px] hover:cursor-pointer hover:underline ${selectedFilter.data === index ? "border-primary bg-button border-1 font-bold text-white" : "font-normal"} hover:bg-button rounded-lg px-2 py-[2px]`}
                    onClick={() =>
                      setSelectedFilter({ ...selectedFilter, data: index })
                    }
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
                  className={`text-secondary ml-1 text-[11px] hover:cursor-pointer hover:underline ${selectedFilter.timeFrame === index ? "border-primary bg-button border-1 font-bold text-white" : "font-normal"} hover:bg-button rounded-lg px-2 py-[2px]`}
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
            data={data&& data[selectedCategory]}
          />
        </Suspense>
      </div>
    )
  );
};

const financialReportCategories = [
  {
    title: "Income Statement",
    key: "income_statement",
  },
  {
    title: "Balance Sheet",
    key: "balance_sheet",
  },
  {
    title: "Cash Flow",
    key: "cash_flow",
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
