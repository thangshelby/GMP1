'use client'

import { usePdfStore } from "@/store";
import { formatNumber } from "@/constants";

const PDFPage3 = () => {
  const years = ["2020", "2021", "2022", "2023", "2024"];

  const { financialData } = usePdfStore();

  return (
    financialData.balance_sheet && (
      <div id={'pdf-container'}>
        {/* BODY */}
        <div className="flex h-full flex-col justify-evenly">
          {/* INCOME STATEMENT */}
          <div className="flex flex-col gap-y-2">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                INCOME STATEMENT
              </h2>
            </div>
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="">
                <tr>
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
                {Object.keys(financialData?.income_statement).map(
                  (key, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-[#e6e6e6] p-1" : ""}`}>
                      <td className="border-gray-2 border-r-[1px] align-top text-xs text-black  p pl-2">
                        {key}
                      </td>
                      {key in financialData?.income_statement &&
                        financialData?.income_statement[key].map(
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
          {/* AI ANALYSIS FOR INCOME STATEMENT*/}

          <div className="flex flex-col gap-y-2 text-xs text-black">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                AI ANALYSIS FOR INCOME STATEMENT
              </h2>
            </div>
            <p className="text-xs text-black">
              {financialData.ai_analysis.income_statement}
            </p>
          </div>

          {/* PROFITABILITY ANALYSIS */}
          <div className="flex flex-col gap-y-2">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                PROFITABILITY ANALYSIS
              </h2>
            </div>
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="">
                <tr>
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
                {Object.keys(financialData?.profitability_analysis).map(
                  (key, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-[#e6e6e6] p-1" : ""}`}>
                      <td className="border-gray-2 border-r-[1px] align-top text-xs text-black  p pl-2">
                        {key}
                      </td>
                      {key in financialData?.profitability_analysis &&
                        financialData?.profitability_analysis[key].map(
                          (value, index) => (
                            <td
                              key={index}
                              className="border-gray-2 border-r-[1px] text-center align-top text-xs text-black p-1"
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
          {/* AI ANALYSIS FOR PROFITABILITY ANALYSIS*/}

          <div className="flex flex-col gap-y-2 text-xs text-black">
            <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
                AI ANALYSIS FOR PROFITABILITY ANALYSIS
              </h2>
            </div>
            <p className="text-xs text-black">
              {financialData.ai_analysis.profitability_analysis}
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default PDFPage3;
