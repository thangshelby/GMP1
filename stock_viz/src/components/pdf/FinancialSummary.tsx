"use client"

import React,{ useEffect } from "react";
import SummaryChart from "./SummaryChart";
import { usePdfStore } from "@/store";
import { formatNumber } from "@/constants";
import { fetchAPI } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
const FinancialSummary = () => {
  const financialSummary = "Hello World";
  const symbol = useSearchParams().get("symbol") || "VCB";

  const { financialData, setFinancialData } = usePdfStore();
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
      <div className="container mx-auto flex flex-col justify-between bg-white p-8">
        {/* BODY */}
        <div className="flex flex-col space-y-12">
          {/* FINANCIAL SUMMARY */}
          <div className="flex flex-col gap-y-2">
            <div className="border-b-[1px] border-dashed border-gray pb-3">
              <h2 className="border-t-[2px] border-blue text-base font-medium text-blue uppercase">
                FINANCIAL SUMMARY
              </h2>
            </div>
            <p className="text-xs text-black">{financialSummary}</p>
          </div>
          {/* BALANCE SHEET */}
          <div className="flex flex-col gap-y-2">
            <div className="border-b-[1px] border-dashed border-gray pb-3">
              <h2 className="border-t-[2px] border-blue text-base font-medium text-blue uppercase">
                BALANCE SHEET
              </h2>
            </div>
            <table className="min-w-full table-auto border border-gray-2">
              <thead className="">
                <tr>
                  <th className="border-r-[1px] border-gray-2 text-xs  text-blue"></th>
                  {years.map((year, index) => (
                    <th
                      key={index}
                      className="border-r-[1px] border-gray-2 text-xs  text-blue"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(financialData?.balance_sheet!).map(
                  (key, index) => (
                    <tr key={index} className={``}>
                      <td
                        className={`border-r-[1px] border-gray-2 align-top text-xs text-black`}
                      >
                        {key}
                      </td>
                      {key in financialData?.balance_sheet! &&
                        financialData?.balance_sheet[key].map(
                          (value, index) => (
                            <td
                              key={index}
                              className={`border-r-[1px] border-gray-2 text-center align-top text-xs text-black`}
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
            <div className="border-b-[1px] border-dashed border-gray pb-3">
              <h2 className="border-t-[2px] border-blue text-base font-medium text-blue uppercase">
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
