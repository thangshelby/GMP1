"use client";

import { fetchAPI } from "@/lib/utils";
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

export default function StockChart() {
  const symbol = useSearchParams().get("symbol") || "VCB";
  const [newsVCI, setNews] = useState<CompanyNewsTypeSourceVCI[]>([]);
  const [newsTCBS, setNewsTCBS] = useState<CompanyNewsTypeSourceTCBS[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<CompanySubsidiaryType[]>([]);
  const [officers, setOfficers] = useState<CompanyOfficerType[]>([]);
  const [overview, setOverview] = useState<CompanyOverviewType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `/company/company_metadata?symbol=${symbol}`,
      );
      console.log(response)
      if (response) {
        setNews(response.news.news_vci);
        setNewsTCBS(response.news.news_tcbs);
        setSubsidiaries(response.subsidiaries);
        setOfficers(response.officers);
        setOverview(response.overview[0]);
        setLoading(false);
      } else {
        setError("No news found");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
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
