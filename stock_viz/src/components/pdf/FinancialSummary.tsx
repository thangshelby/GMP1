import { useEffect } from "react";
import { StockInfomationType } from "../type";
import SummaryChart from "./SummaryChart";
import { format, subMonths } from "date-fns";
import { footerContent } from "@/constants";
import { useFinancialDataStore, useClosePriceStore } from "@";
import { formatNumber } from "@/constants";
const FinancialSummary = ({
  symbol,
  financialSummary,
  stockInfo,
}: {
  symbol: string;
  financialSummary: string;
  stockInfo: StockInfomationType;
}) => {
  // const [financialData, setFinancialData] = useState<FinancialDataType>();
  const { financialData, setFinancialData } = useFinancialDataStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/reports/financial?symbol=${symbol}`,
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setFinancialData(result);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      }
    };
    fetchData();
  }, []);

  const { closePrice } = useClosePriceStore();

  const years = ["2020", "2021", "2022", "2023", "2024"];
  return (
    financialData && (
      <div className="container mx-auto flex h-[841px] w-[595px] flex-col justify-between bg-white p-8">
        {/*HEADER  */}
        <div className="flex flex-row justify-end">
          <div className="flex flex-col items-end">
            <h1 className="text-lg font-bold">{stockInfo && stockInfo.Name}</h1>
            <h1 className="text-lg font-semibold">
              Close Price:
              {closePrice && closePrice}{" "}
            </h1>
            <h1 className="text-lg font-normal">
              Document Date: {format(subMonths(new Date(), 1), "yyyy-MM-dd")}
            </h1>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-col space-y-12">
          {/* FINANCIAL SUMMARY */}
          <div className="flex flex-col gap-y-2">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                FINANCIAL SUMMARY
              </h2>
            </div>
            <p className="text-[9px]">{financialSummary}</p>
          </div>
          {/* BALANCE SHEET */}
          <div className="flex flex-col gap-y-2">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                BALANCE SHEET
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
                {Object.keys(financialData?.balance_sheet!).map(
                  (key, index) => (
                    <tr key={index} className={``}>
                      <td
                        className={`border-r-[1px] border-gray-300 align-top text-[9px]`}
                      >
                        {key}
                      </td>
                      {key in financialData?.balance_sheet! &&
                        financialData?.balance_sheet[key].map(
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

            {/* AI ANALYSIS FOR BALANCE SHEET */}
          <div className="flex flex-col gap-y-2 text-[9px]">
            <div className="border-b-[1px] border-dashed border-gray-600 pb-3">
              <h2 className="border-t-[2px] border-blue-500 text-base font-medium uppercase text-blue-500">
                AI ANALYSIS FOR BALANCE SHEET
              </h2>
            </div>
            <p className="text-[9px]">
              {financialData.ai_analysis.balance_sheet}
            </p>
          </div>

          {/* CHART */}

          <div>
            <SummaryChart symbol={symbol} />
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

export default FinancialSummary;
