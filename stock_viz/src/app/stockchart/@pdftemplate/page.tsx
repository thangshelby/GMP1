"use client";
import React from "react";
import { footerContent } from "@/constants";
import {
  BusinessSummary,
  FinancialSummary,
  PDFPage3,
  PDFPage4,
} from "@/components";
import { format, subMonths } from "date-fns";
import { usePdfStore } from "@/store";
import { formatNumber } from "@/constants";
import Image from "next/image";
export default function PdfTemplate() {
  const { businessData, closePrice } = usePdfStore();
  const currentDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");

  return (
    <div
      style={{
        position: "absolute",
        left: "-10000px",
        top: "-10000px",
      }}
      className="flex w-full flex-col items-center justify-center space-y-4"
    >
      {/* {pdfPages.map((page) => (
        <div
          key={page.id}
          id={page.id}
          className="h-[1123px] w-[794px] bg-white p-4 shadow-md"
        >
          <div className="flex h-full w-full flex-col justify-between">
            <HeaderSection
              companyName={
                businessData?.company_detail?.company_short_name
                  ? businessData?.company_detail?.company_short_name
                  : "Vietcombank"
              }
              currentDate={currentDate}
              closePrice={closePrice}
            />
            <div className="flex-1 overflow-hidden">{page.component}</div>
            <FooterSection />
          </div>
        </div>
      ))} */}
    </div>
  );
}

export const pdfPages = [
  {
    title: "Business Summary",
    id: "business-summary",
    component: <BusinessSummary />,
  },
  {
    title: "Financial Summary",
    id: "financial-summary",
    component: <FinancialSummary />,
  },
  {
    title: "PDF Page 3",
    id: "pdf-page-3",
    component: <PDFPage3 />,
  },
  {
    title: "PDF Page 4",
    id: "pdf-page-4",
    component: <PDFPage4 />,
  },
];

const HeaderSection = ({
  companyName,
  currentDate,
  closePrice,
}: {
  companyName: string;
  currentDate: string;
  closePrice: number;
}) => {
  return (
    <div className="flex flex-row justify-end">
      <div className="flex flex-col items-end">
        <h1 className="text-lg font-bold text-black">
          {companyName.toLocaleUpperCase()}
        </h1>
        <h1 className="text-md font-semibold text-black">
          Close Price: {formatNumber(closePrice)}
        </h1>
        <h1 className="text-sm font-light text-black">
          Document Date: {currentDate}
        </h1>
      </div>
    </div>
  );
};

const FooterSection = () => (
  <div className="flex w-full flex-row items-center justify-between border-t-2 pt-2 text-[#6a7282]">
    <p className="text-3xs w-[80%]">{footerContent}</p>
    <div className="h-24 w-24">
      <Image
        src="https://upload.wikimedia.org/wikipedia/commons/8/88/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_kinh_t%E1%BA%BF_-_Lu%E1%BA%ADt_%28UEL%29%2C_%C4%90HQG-HCM%2C_220px.png"
        alt="Logo"
        width={100}
        height={100}
        style={{
          width: "auto",
          height: "100%",
        }}
      />
    </div>
  </div>
);
