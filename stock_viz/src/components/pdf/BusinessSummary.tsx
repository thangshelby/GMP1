"use client";
import { useEffect } from "react";
import LineChart from "./charts/LineChart";
import { format, subYears } from "date-fns";
import { useSearchParams } from "next/navigation";
import { usePdfStore } from "@/store";
import { formatNumber } from "@/constants";
import { useQuery } from "@tanstack/react-query";
import { getBusinessReport } from "@/apis/report";
const BusinessSummary = () => {
  const { businessData, setBusinessData } = usePdfStore();
  const symbol = useSearchParams().get("symbol") || "VCB";
  const start_date = format(subYears(new Date(), 2), "yyyy-MM-dd");
  const end_date = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const result = useQuery({
    queryKey: ["businessReport", symbol, start_date, end_date],
    queryFn: () => getBusinessReport(symbol, start_date, end_date),
  });

  useEffect(() => {
    if (!result.data) return;
    setBusinessData(result.data);
  }, [result.data, result.isSuccess, setBusinessData]);

  return (
    businessData.general_information && (
      <div id={"pdf-container"}>
        {/* BODY */}
        <div className="flex h-full flex-col justify-evenly">
          {/* COMPANY DETAIL AND COMPANY INFO */}
          <div className="flex flex-row justify-between space-x-6">
            <RenderCategory
              category={businessData?.general_information}
              title={"General Information"}
            />

            <RenderCategory
              category={businessData?.company_detail}
              title={"Company Detail"}
            />
          </div>

          {/* Business Summary */}
          <div className="border-blue rounded border-t-[2px] bg-white">
            <h2 className="border-b-gray text-blue border-dashed pb-1 text-xs font-medium uppercase">
              Business Summary
            </h2>
            <p className="text-xs text-black">
              {businessData?.business_summary}
            </p>
          </div>

          {/* Charts Section */}
          <div className="flex flex-row justify-between space-x-6">
            <div className="border-t-blue w-full flex-col rounded border-t-[2px]">
              <h2 className="text-gray mb-2 text-xs font-semibold">6 Months</h2>

              <div className="w-full">
                <LineChart duration="6 Months" />
              </div>
            </div>

            <div className="border-t-blue w-full flex-col rounded border-t-[2px]">
              <h2 className="text-gray mb-2 text-xs font-semibold">5 Years</h2>
              <div className="w-full">
                <LineChart duration="5 Years" />
              </div>
            </div>
          </div>

          {/* Share Detail AND Percentage Change */}
          <div className="flex flex-row justify-between space-x-6">
            {/* Share Detail */}

            <RenderCategory
              category={businessData?.share_detail}
              title={"Share Detail"}
            />
            {/* Percentage Change */}
            <RenderCategory
              category={businessData?.percentage_change}
              title={"Percentage Change"}
            />
          </div>

          {/* Analyst Outlook AND Ratio */}
          <div className="flex flex-row justify-between space-x-6">
            <RenderCategory
              category={businessData?.analyst_outlook}
              title={"Analyst Outlook"}
            />

            {/* Ratios */}
            <RenderCategory category={businessData?.ratio} title={"Ratios"} />
          </div>
        </div>
      </div>
    )
  );
};

export default BusinessSummary;

const renderTitle = (title: string) => {
  const res = title
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return res;
};

const RenderCategory = ({
  category,
  title,
}: {
  category: Record<string, number | string | null>;
  title: string;
}) => {
  return (
    <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
      <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
        {title}
      </h2>
      <ul className="mt-2 flex flex-col">
        {Object.keys(category).map((key: string, index: number) => (
          <li
            key={key}
            className={`text-2xs flex flex-row p-1 align-text-top text-black ${index % 2 === 0 ? "rounded-[1px] bg-[#e6e6e6]" : "bg-white"} `}
          >
            <strong className="text-2xs w-[40%] text-black">
              {renderTitle(key)}
            </strong>{" "}
            {typeof category[key] === "number"
              ? formatNumber(Math.round(category[key] * 100) / 100)
              : category[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};
