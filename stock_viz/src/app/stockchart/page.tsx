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
} from "@/components";
import { getCompanyMetadata } from "@/apis/compant";
import { useQuery } from "@tanstack/react-query";

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
      // setOverview(result.data?.overview[0] || undefined);

    }
  }, [result.data, result.isSuccess]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 bg-[#22262f] p-4 py-12">
      <div className="flex flex-col space-y-2">
      <div className="flex w-full flex-row items-end space-x-2">
          <CompanyOverview companyOverview={overview} />  
          <CompanySubsidiary subsidiaries={subsidiaries} />
        </div>
        <div className="flex w-full flex-row items-start space-x-2">
          <CompanyOfficer companyOfficers={officers} />
          <CompanyNews newsVCI={newsVCI} newsTCBS={newsTCBS} />
        </div>
      
      </div>

      <FinancialReport />
    </div>
  );
}
