"use client";
import { useEffect } from "react";
import LineChart from "./LineChart";
import { subMonths, format } from "date-fns";
import { fetchAPI } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { usePdfStore } from "@/store";
import { formatNumber } from "@/constants";
const BusinessSummary = () => {
  const { businessData, setBusinessData } = usePdfStore();
  const symbol = useSearchParams().get("symbol") || "VCB";

  useEffect(() => {
    const fetchPdfInfo = async () => {
      const response = await fetchAPI(
        `/reports/business?symbol=${symbol}&date=${format(subMonths(new Date(), 1), "yyyy-MM-dd")}`,
      );

      setBusinessData(response);
    };

    fetchPdfInfo();
  }, []);

  return (
    businessData.general_info  && (
      <div className="container mx-auto flex flex-col justify-between bg-white p-8">
        {/* BODY */}
        <div className="flex flex-col space-y-4">
          {/* COMPANY DETAIL AND COMPANY INFO */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* General Information */}
            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
                General Information
              </h2>
              <ul className="mt-2">
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">Exchange Code:</strong>{" "}
                  {businessData?.general_info?.exchange}
                </li>
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">TRBC Industry:</strong>{" "}
                  {businessData?.general_info.industry}
                </li>
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">
                    No. of Employees:
                  </strong>{" "}
                  {businessData?.general_info.noe}
                </li>
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">
                    Company Market Cap (VND):
                  </strong>{" "}
                  169,720.61B
                </li>
              </ul>
            </div>

            {/* Company Details */}
            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
                Company Details
              </h2>
              <ul className="mt-2">
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">Address: </strong>
                  VIET NAM
                </li>
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">Telephone:</strong> +84
                  (22) 8 3724 4555
                </li>
                <li className="text-xs text-black">
                  <strong className="text-xs text-black">Company Link:</strong>{" "}
                  <a
                    href="https://www.hoaphat.com.vn"
                    className="text-lg text-blue underline"
                  >
                    {businessData?.company_detail.website}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Business Summary */}
          <div className="border-blue rounded border-t-[0px] bg-white">
            <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
              Business Summary
            </h2>
            <p className="pb-8 text-xs text-black">
              {businessData?.business_summary}
            </p>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="text-gray mb-2 text-lg font-semibold">6 Months</h2>

              <div className="w-full bg-gray-2">
                <LineChart
                  duration="6 Months"
                  setClosePrice={(close: number) => {
                    // setClosePrice(close);
                  }}
                />
              </div>
            </div>

            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="text-gray mb-2 text-lg font-semibold">5 Years</h2>
              <div className="w-full bg-gray-2">
                <LineChart duration="5 Years" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Share Detail */}
            {businessData && (
              <div className="border-blue rounded border-t-[2px] bg-white">
                <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
                  Share Detail
                </h2>
                <ul className="mt-2">
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      Close Price
                    </strong>{" "}
                    <p className="text-xs text-black">{formatNumber(0)}</p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      5 Days Average Volumne
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(
                        businessData?.share_detail["5_day_avg_volume"]!,
                      )}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      10 Days Average Volumne
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(
                        businessData?.share_detail["10_day_avg_volume"]!,
                      )}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      52 Wk high
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {businessData?.share_detail["52_wk_high_high"]! || "-.-"}
                    </p>
                  </li>

                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      Beta Value
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(businessData?.share_detail.beta_value!)}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      Currency
                    </strong>{" "}
                    <p className="text-xs text-black">VND</p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[60%] text-xs text-black">
                      Shares Outstanding
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(
                        businessData?.share_detail.shares_outstanding!,
                      )}
                    </p>
                  </li>
                </ul>
              </div>
            )}

            {/* Percentage Change */}
            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
                Percentage Change
              </h2>
              {businessData && (
                <ul className="mt-2">
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[40%] text-xs text-black">
                      1 Day
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(businessData.percentage_change["1_day"])}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[40%] text-xs text-black">
                      5 Days
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(businessData.percentage_change["5_day"])}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[40%] text-xs text-black">
                      3 Months
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(businessData.percentage_change["3_months"])}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[40%] text-xs text-black">
                      6 Months
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(businessData.percentage_change["6_months"])}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[40%] text-xs text-black">
                      Month To Date
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(
                        businessData.percentage_change.month_to_date,
                      )}
                    </p>
                  </li>
                  <li className="flex flex-row text-xs text-black">
                    <strong className="w-[40%] text-xs text-black">
                      Year To Date
                    </strong>{" "}
                    <p className="text-xs text-black">
                      {formatNumber(
                        businessData.percentage_change.year_to_date,
                      )}
                    </p>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Analyst Outlook */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
                Analyst Outlook
              </h2>
              <ul className="mt-2">
                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.analyst_outlook.buy}
                  </p>
                </li>

                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.analyst_outlook.hold}
                  </p>
                </li>

                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.analyst_outlook.sell}
                  </p>
                </li>
                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.analyst_outlook.suggest}
                  </p>
                </li>
              </ul>
            </div>

            {/* Ratios */}
            <div className="border-blue rounded border-t-[2px] bg-white">
              <h2 className="border-b-gray text-md border-b-[1px] border-dashed pb-3 font-medium text-blue uppercase">
                Ratios
              </h2>
              <ul className="mt-2">
                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.ratio.dividend_yield}
                  </p>
                </li>
                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.ratio.dividend_yield}
                  </p>
                </li>
                <li className="flex flex-row text-xs text-black">
                  <strong className="w-[40%] text-xs text-black">
                    Month To Date
                  </strong>{" "}
                  <p className="text-xs text-black">
                    {businessData?.ratio.pe_ttm}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default BusinessSummary;
