"use client";
import React from "react";
import { fetchAPI } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
  CompanyNewsTypeSourceVCI,
  CompanyNewsTypeSourceTCBS,
  CompanySubsidiaryType,
} from "@/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CompanyNews = () => {
  const symbol = useSearchParams().get("symbol");
  const [newsVCI, setNews] = React.useState<CompanyNewsTypeSourceVCI[]>([]);
  const [newsTCBS, setNewsTCBS] = React.useState<CompanyNewsTypeSourceTCBS[]>(
    [],
  );
  const [subsidiaries, setSubsidiaries] = React.useState<
    CompanySubsidiaryType[]
  >([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      const response = await fetchAPI(`/company/news?symbol=${symbol}`);

      if (response) {
        setNews(response.news_vci);
        setNewsTCBS(response.news_tcbs);
        setSubsidiaries(response.subsidiaries);
        setLoading(false);
      } else {
        setError("No news found");
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div>Loading ...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex w-full flex-row items-end gap-2">
      <div className="flex w-[60%] flex-col rounded-sm border-1 border-white bg-[#1c2331] p-1">
        {newsVCI.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              window.open(item.news_source_link, "_blank");
            }}
            className="flex flex-row items-center space-x-2 rounded-xs border-b border-[#2a2f3b] p-1 hover:cursor-pointer hover:bg-[#1b3559]"
          >
            <div className="text-secondary text-[11px] font-normal">
              {format(new Date(item.public_date), "MMMM-dd-yy hh:ma")}
            </div>

            <div className="text-primary text-[11px] font-medium">
              {item.news_short_content}
            </div>
            <div
              className={`${item.close_price - (item.ceiling + item.floor / 2) > 0 ? "bg-green" : "bg-red"} text-2xs rounded-xs px-2 py-[2px] font-medium text-white`}
            >
              {(
                ((item.close_price - (item.ceiling + item.floor / 2)) /
                  (item.ceiling + item.floor / 2)) *
                100
              ).toFixed(2)}
              %
            </div>
          </div>
        ))}
        {newsTCBS.map((item) => (
          <div key={item.id}  className="flex flex-row items-center space-x-2 rounded-xs border-b border-[#2a2f3b] p-1 hover:cursor-not-allowed hover:bg-[#1b3559]">
            <div className="text-secondary text-[11px] font-normal">
              {format(new Date(item.publish_date), "MMMM-dd-yy hh:ma")}
            </div>

            <div className="text-primary text-[11px] font-medium">
              {item.title}
            </div>
            <div
              className={`${item.price_change > 0 ? "bg-green" : "bg-red"} text-2xs rounded-xs px-2 py-[2px] font-medium text-white`}
            >
              {(item.price_change_ratio * 100).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div className="w-[50%] rounded-sm border-1 border-white p-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-secondary text-[11px] font-normal">
                Organization Name
              </TableHead>

              <TableHead className="text-secondary text-[11px] font-normal">
                Percent
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subsidiaries.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-primary truncate text-[11px] font-normal">
                  {item.sub_company_name
                    .replace("Công ty", "CT")
                    .replace("Công Ty", "CT")}
                </TableCell>

                <TableCell className="text-green text-[11px] font-normal">
                  {item.sub_own_percent}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyNews;
