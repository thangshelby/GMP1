import { useEffect } from "react";
import LineChart from "./LineChart";
import { subMonths, format } from "date-fns";
import { StockInfomationType } from "../type";
import { footerContent } from "../constant";
import { useClosePriceStore, useBusinessDataStore } from "../store/store";
import { formatNumber } from "../constant";
const BusinessSummary = ({
  symbol,
  stockInfo,
  setFinancialSummary,
}: {
  symbol: string;
  stockInfo: StockInfomationType;
  setFinancialSummary: (value: string) => void;
}) => {
  const { businessData, setBusinessData } = useBusinessDataStore();
  const { closePrice, setClosePrice } = useClosePriceStore();

  useEffect(() => {
    const fetchPdfInfo = async () => {
      const response = await fetch(
        `http://localhost:5000/reports/business?symbol=${symbol}&date=${format(subMonths(new Date(), 1), "yyyy-MM-dd")}`,
      );
      const data = await response.json();

      const financial = data.financial_summary;

      setFinancialSummary(financial);
      setBusinessData(data);
    };

    fetchPdfInfo();
  }, []);

  return (
    <div className="container mx-auto flex h-[842px] w-[595px] flex-col justify-between bg-white p-8">
      {/*HEADER  */}
      <div className="flex flex-row justify-end">
        <div className="flex flex-col items-end">
          <h1 className="text-lg font-bold">{stockInfo && stockInfo.Name}</h1>
          <h1 className="text-lg font-semibold">
            Close Price:{closePrice && closePrice}{" "}
          </h1>
          <h1 className="text-lg font-normal">
            Document Date: {format(subMonths(new Date(), 1), "yyyy-MM-dd")}
          </h1>
        </div>
      </div>

      {/* BODY */}
      <div className="flex flex-col space-y-4">
        {/* COMPANY DETAIL AND COMPANY INFO */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* General Information */}
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
              General Information
            </h2>
            <ul className="mt-2">
              <li className="text-[9px]">
                <strong className="text-[9px]">Exchange Code:</strong>{" "}
                {businessData?.general_info.exchange}
              </li>
              <li className="text-[9px]">
                <strong className="text-[9px]">TRBC Industry:</strong>{" "}
                {businessData?.general_info.industry}
              </li>
              <li className="text-[9px]">
                <strong className="text-[9px]">No. of Employees:</strong>{" "}
                {businessData?.general_info.noe}
              </li>
              <li className="text-[9px]">
                <strong className="text-[9px]">
                  Company Market Cap (VND):
                </strong>{" "}
                169,720.61B
              </li>
            </ul>
          </div>

          {/* Company Details */}
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
              Company Details
            </h2>
            <ul className="mt-2">
              <li className="text-[9px]">
                <strong className="text-[9px]">Address: </strong>
                VIET NAM
              </li>
              <li className="text-[9px]">
                <strong className="text-[9px]">Telephone:</strong> +84 (22) 8
                3724 4555
              </li>
              <li className="text-[9px]">
                <strong className="text-[9px]">Company Link:</strong>{" "}
                <a
                  href="https://www.hoaphat.com.vn"
                  className="text-lg text-blue-500 underline"
                >
                  {businessData?.company_detail.website}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Business Summary */}
        <div className="rounded border-t-[0px] border-blue-500 bg-white">
          <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
            Business Summary
          </h2>
          <p className="pb-8 text-[9px]">{businessData?.business_summary}</p>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="mb-2 text-lg font-semibold">6 Months</h2>

            <div className="bg-gray-200">
              <LineChart
                duration="6 Months"
                symbol={symbol}
                setClosePrice={(close: number) => setClosePrice(close)}
              />
            </div>
          </div>

          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="mb-2 text-lg font-semibold">5 Years</h2>
            <div className="bg-gray-200">
              <LineChart duration="5 Years" symbol={symbol} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Share Detail */}
          {businessData && (
            <div className="rounded border-t-[2px] border-blue-500 bg-white">
              <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
                Share Detail
              </h2>
              <ul className="mt-2">
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">Close Price</strong>{" "}
                  <p className="text-[9px]">{formatNumber(closePrice)}</p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">
                    5 Days Average Volumne
                  </strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(
                      businessData?.share_detail["5_day_avg_volume"]!,
                    )}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">
                    10 Days Average Volumne
                  </strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(
                      businessData?.share_detail["10_day_avg_volume"]!,
                    )}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">52 Wk high</strong>{" "}
                  <p className="text-[9px]">
                    {businessData?.share_detail["52_wk_high_high"]! || "-.-"}
                  </p>
                </li>

                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">Beta Value</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData?.share_detail.beta_value!)}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">Currency</strong>{" "}
                  <p className="text-[9px]">VND</p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[60%] text-[9px]">
                    Shares Outstanding
                  </strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(
                      businessData?.share_detail.shares_outstanding!,
                    )}
                  </p>
                </li>
              </ul>
            </div>
          )}

          {/* Percentage Change */}
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
              Percentage Change
            </h2>
            {businessData && (
              <ul className="mt-2">
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[40%] text-[9px]">1 Day</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData.percentage_change["1_day"])}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[40%] text-[9px]">5 Days</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData.percentage_change["5_day"])}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[40%] text-[9px]">3 Months</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData.percentage_change["3_months"])}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[40%] text-[9px]">6 Months</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData.percentage_change["6_months"])}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData.percentage_change.month_to_date)}
                  </p>
                </li>
                <li className="flex flex-row text-[9px]">
                  <strong className="w-[40%] text-[9px]">Year To Date</strong>{" "}
                  <p className="text-[9px]">
                    {formatNumber(businessData.percentage_change.year_to_date)}
                  </p>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Analyst Outlook */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
              Analyst Outlook
            </h2>
            <ul className="mt-2">
              <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                  {businessData?.analyst_outlook.buy}
                </p>
              </li>

              <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                  {businessData?.analyst_outlook.hold}
                </p>
              </li>

              <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                  {businessData?.analyst_outlook.sell}
                </p>
              </li>
              <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                  {businessData?.analyst_outlook.suggest}
                </p>
              </li>
            </ul>
          </div>

          {/* Ratios */}
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
              Ratios
            </h2>
            <ul className="mt-2">
            <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                {businessData?.ratio.dividend_yield}

                </p>
              </li>
              <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                {businessData?.ratio.dividend_yield}

                </p>
              </li>
              <li className="flex flex-row text-[9px]">
                <strong className="w-[40%] text-[9px]">Month To Date</strong>{" "}
                <p className="text-[9px]">
                {businessData?.ratio.pe_ttm}

                </p>
              </li>
            
            </ul>
          </div>
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
  );
};

export default BusinessSummary;
