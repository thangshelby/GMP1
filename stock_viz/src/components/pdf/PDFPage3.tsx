import { useFinancialDataStore } from "@/store/store";
import { footerContent } from "@/constants";
import { StockInfomationType } from "@/types";
import { format, subMonths } from "date-fns";
import { formatNumber } from "@/constants";
import { useClosePriceStore } from "@/store/store";

const PDFPage3 = ({
  stockInfo,
  // symbol,
}: {
  stockInfo: StockInfomationType;
  // symbol: string;
}) => {
  const years = ["2020", "2021", "2022", "2023", "2024"];
  const { financialData } = useFinancialDataStore();

  const { closePrice } = useClosePriceStore();
  // console.log(symbol)
  return (
    financialData && (
      <div className="container mx-auto flex h-[841px] w-[595px] flex-col justify-between bg-white p-8">
        {/*HEADER  */}
        <div className="flex flex-row justify-end">
          <div className="flex flex-col items-end">
            <h1 className="text-lg font-bold">{stockInfo && stockInfo.Name}</h1>
            <h1 className="text-lg font-semibold">
              Close Price: {closePrice && closePrice}{" "}
            </h1>
            <h1 className="text-lg font-normal">
              Document Date: {format(subMonths(new Date(), 1), "yyyy-MM-dd")}
            </h1>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-col space-y-12">
          {/* INCOME STATEMENT */}
          <div className="flex flex-col gap-y-2">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                INCOME STATEMENT
              </h2>
            </div>
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="">
                <tr>
                  <th className="border-r-[1px] border-gray-300 text-[9px] text-blue-500"></th>
                  {years.map((year, index) => (
                    <th
                      key={index}
                      className="border-r-[1px] border-gray-300 text-[9px] text-blue-500"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(financialData?.income_statement!).map(
                  (key, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "" : ""}`}>
                      <td className="border-r-[1px] border-gray-300 align-top text-[9px]">
                        {key}
                      </td>
                      {key in financialData?.income_statement! &&
                        financialData?.income_statement[key].map(
                          (value, index) => (
                            <td
                              key={index}
                              className={`border-r-[1px] border-gray-300 text-center align-top text-[9px]`}
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

          <div className="flex flex-col gap-y-2 text-[9px]">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                AI ANALYSIS FOR INCOME STATEMENT
              </h2>
            </div>
            <p className="text-[9px]">
              {financialData.ai_analysis.income_statement}
            </p>
          </div>

          {/* PROFITABILITY ANALYSIS */}
          <div className="flex flex-col gap-y-2">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                PROFITABILITY ANALYSIS
              </h2>
            </div>
            <table className="min-w-full table-auto border border-gray-200">
              <thead className="">
                <tr>
                  <th className="border-r-[1px] border-gray-300 text-[9px] text-blue-500"></th>
                  {years.map((year, index) => (
                    <th
                      key={index}
                      className="border-r-[1px] border-gray-300 text-[9px] text-blue-500"
                    >
                      {year}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(financialData?.profitability_analysis!).map(
                  (key, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "" : ""}`}>
                      <td className="border-r-[1px] border-gray-300 align-top text-[9px]">
                        {key}
                      </td>
                      {key in financialData?.profitability_analysis! &&
                        financialData?.profitability_analysis[key].map(
                          (value, index) => (
                            <td
                              key={index}
                              className="border-r-[1px] border-gray-300 text-center align-top text-[9px]"
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

          <div className="flex flex-col gap-y-2 text-[9px]">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                AI ANALYSIS FOR PROFITABILITY ANALYSIS
              </h2>
            </div>
            <p className="text-[9px]">
              {financialData.ai_analysis.profitability_analysis}
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="flex w-full flex-row items-center justify-between border-t-[2px] border-gray-500 pt-2">
          <p className="w-[80%] text-[6px] text-gray-500">{footerContent}</p>

          <div className="h-24 w-24">
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/commons/8/88/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_kinh_t%E1%BA%BF_-_Lu%E1%BA%ADt_%28UEL%29%2C_%C4%90HQG-HCM%2C_220px.png"
              }
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    )
  );
};

export default PDFPage3;
