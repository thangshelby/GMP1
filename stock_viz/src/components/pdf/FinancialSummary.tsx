"use client";

import React, { useEffect } from "react";
import SummaryChart from "./charts/SummaryChart";
import { usePdfStore } from "@/store";
import { formatNumber } from "@/constants";
import { fetchAPI } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
const FinancialSummary = () => {
  const symbol = useSearchParams().get("symbol") || "VCB";

  const { financialData, setFinancialData, businessData } = usePdfStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAPI(`/reports/financial?symbol=${symbol}`);
        setFinancialData(response);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };
    fetchData();
  }, []);

  const years = ["2020", "2021", "2022", "2023", "2024"];
  return (
    financialData.balance_sheet && (
      <div id={"pdf-container"}>
        {/* BODY */}
        <div className="flex flex-col justify-evenly">
          {/* FINANCIAL SUMMARY */}
          <div className="flex flex-col gap-y-2">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                FINANCIAL SUMMARY
              </h2>
            </div>
            <p className="text-xs text-black">
              {businessData.financial_summary}
            </p>
          </div>
          {/* BALANCE SHEET */}
          <div className="flex flex-col gap-y-2">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                BALANCE SHEET
              </h2>
            </div>
            <table className="border-gray-2 min-w-full table-auto border ">
              <thead className="">
                <tr className="pl-2">
                  <th className="border-gray-2 text-blue border-r-[1px] text-xs"></th>
                  {years.map((year, index) => (
                    <th
                      key={index}
                      className="border-gray-2 text-blue border-r-[1px] text-xs"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(financialData?.balance_sheet!).map(
                  (key, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-[#e6e6e6]" : ""}`}>
                      <td
                        className={`border-gray-2 border-r-[1px] align-top text-xs text-black p-1 pl-2`}
                      >
                        
                        {key}
                      </td>
                      {key in financialData?.balance_sheet! &&
                        financialData?.balance_sheet[key].map(
                          (value, index) => (
                            <td
                              key={index}
                              className={`border-gray-2 border-r-[1px] text-center align-top text-xs text-black p-1`}
                            >
                              {formatNumber(parseFloat(value.toFixed(2)))}
                            </td>
                          ),
                        )}
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          {/* AI ANALYSIS FOR BALANCE SHEET */}
          <div className="flex flex-col gap-y-2 text-xs text-black">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                AI ANALYSIS FOR BALANCE SHEET
              </h2>
            </div>
            <p className="text-xs text-black">
              {financialData.ai_analysis.balance_sheet}
            </p>
          </div>

          {/* CHART */}

          <div>
            <SummaryChart symbol={symbol} />
          </div>
        </div>
      </div>
    )
  );
};

export default FinancialSummary;
