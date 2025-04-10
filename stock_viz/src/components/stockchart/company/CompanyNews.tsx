import React from "react";
import {
  CompanyNewsTypeSourceVCI,
  CompanyNewsTypeSourceTCBS,
} from "@/types";
import { format } from "date-fns";

const CompanyNews = ({
  newsVCI,
  newsTCBS,
}: {
  newsVCI: CompanyNewsTypeSourceVCI[];
  newsTCBS: CompanyNewsTypeSourceTCBS[];
}) => {
  return (
  
      <div className="flex w-[40%] flex-col rounded-sm border-1 border-white bg-[#1c2331] p-1">
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
          <div
            key={item.id}
            className="flex flex-row items-center space-x-2 rounded-xs border-b border-[#2a2f3b] p-1 hover:cursor-not-allowed hover:bg-[#1b3559]"
          >
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
   
  );
};

export default CompanyNews;
