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
    businessData.general_infomation && (
      <div className="container mx-auto flex h-full flex-col justify-between bg-white p-8">
        {/* BODY */}
        <div className="flex h-full flex-col justify-between">
          {/* COMPANY DETAIL AND COMPANY INFO */}
          <div className="flex flex-row justify-between space-x-6">
            <RenderCategory
              category={businessData?.general_infomation}
              title={"General Information"}
            />

            <RenderCategory
              category={businessData?.company_detail}
              title={"Company Detail"}
            />
          </div>

          {/* Business Summary */}
          <div className="border-blue rounded border-t-[2px] bg-white">
            <h2 className="border-b-gray text-xs text-blue  border-dashed pb-1 font-medium uppercase">
              Business Summary
            </h2>
            <p className="text-xs text-black">
              {businessData?.business_summary}
            </p>
          </div>

          {/* Charts Section */}
          <div className="flex flex-row justify-between space-x-6">
            <div className="border-t-blue w-full rounded border-t-[2px]">
              <h2 className="text-gray text-xs mb-2 font-semibold">6 Months</h2>

              <div className="bg-gray-2 w-full">
                <LineChart
                  duration="6 Months"
                  setClosePrice={(close: number) => {
                    // setClosePrice(close);
                  }}
                />
              </div>
            </div>

            <div className="border-t-blue w-full rounded border-t-[2px]">
              <h2 className="text-gray text-xs mb-2 font-semibold">5 Years</h2>
              <div className="bg-gray-2 w-full">
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
  category: any;
  title: string;
}) => {
  return (
    <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
      <h2 className="border-b-gray text-xs text-blue border-b-[1px] border-dashed pb-1 font-medium uppercase">
        {title}
      </h2>
      <ul className="mt-2 flex flex-col ">
        {Object.keys(category).map((key: any, index) => (
          <li key={key} className={`flex align-text-top flex-row pb-1 px-1 text-2xs text-black
          ${index % 2 === 0 ? "bg-[#e6e6e6] rounded-[2px]" : "bg-white"}
          `}>
            <strong className="w-[40%] text-2xs text-black">
              {renderTitle(key)}
            </strong>{" "}
            {typeof category[key] === "number"
              ? formatNumber(category[key])
              : category[key]}
          </li>
        ))}
      </ul>
    </div>
  );
};
