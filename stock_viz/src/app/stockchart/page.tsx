"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  CompanyNewsTypeSourceVCI,
  CompanyNewsTypeSourceTCBS,
  CompanySubsidiaryType,
  CompanyOfficerType,
  CompanyOverviewType,
} from "@/types";

import {
  CompanyOfficer,
  CompanyNews,
  CompanyOverview,
  CompanySubsidiary,
  FinancialReport,
  StockChartSkeleton,
} from "@/components";
import { getCompanyMetadata } from "@/apis/compant";
import { useQuery } from "@tanstack/react-query";
import SummaryChart from "@/components/pdf/charts/SummaryChart";
export default function StockChart() {
  const symbol = useSearchParams().get("symbol") || "VCB";
  const [newsVCI, setNews] = useState<CompanyNewsTypeSourceVCI[]>([]);
  const [newsTCBS, setNewsTCBS] = useState<CompanyNewsTypeSourceTCBS[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<CompanySubsidiaryType[]>([]);
  const [officers, setOfficers] = useState<CompanyOfficerType[]>([]);
  const [overview, setOverview] = useState<CompanyOverviewType>();

  const result = useQuery({
    queryKey: [`company/company_metadata?symbol=${symbol}`],
    queryFn: () => getCompanyMetadata(symbol),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (result.isSuccess) {
      setNews(result.data.news?.news_vci || []);
      setNewsTCBS(result.data?.news?.news_tcbs || []);
      setSubsidiaries(result.data?.subsidiaries || []);
      setOfficers(result.data?.officers || []);
      setOverview(result.data?.overview[0] || undefined);
    }
  }, [result.data, result.isSuccess]);

  if (result.isLoading) {
    return <StockChartSkeleton />;
  }

  return (
    <div className="w-full bg-[#22262f] p-4 py-12">
      <div className="flex flex-col gap-8 px-20">
        <div className="flex flex-row gap-2">
          <div className="flex w-2/3 flex-col items-end gap-2">
            <CompanyNews newsVCI={newsVCI} newsTCBS={newsTCBS} />
            <CompanyOverview companyOverview={overview} />
          </div>
          <div className="flex w-1/3 flex-col items-start gap-2">
            <CompanySubsidiary subsidiaries={subsidiaries} />
            <CompanyOfficer companyOfficers={officers} />
          </div>
        </div>
        <SummaryChart symbol={symbol} />

        <FinancialReport />
      </div>
    </div>
  );
}
