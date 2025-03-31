"use client";
import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { footerContent } from "@/constants";
import { BusinessSummary, FinancialSummary } from "@/components";
import { useSearchParams } from "next/navigation";
import { format, subMonths } from "date-fns";
import { usePdfStore } from "@/store";
import * as htmlToImage from "html-to-image";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
export default function PdfTemplate() {
  const symbol = useSearchParams().get("symbol") || "VCB";
  const { closePrice } = usePdfStore();
  const currentDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");

  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [794, 1123], // A4 Size in px
    });

    const node = document.getElementById("business-summary") as HTMLElement;
    const newPageData = await htmlToImage.toPng(node);

    pdf.addImage(newPageData, "PNG", 0, 0, 794, 1123);
    pdf.save(`Financial Report for ${symbol}.pdf`);
  };

  return (
    <div className="relative flex w-full flex-col items-center justify-center space-y-4">
      <button
        onClick={generatePDF}
        className="z-50 rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
      >
        Generate PDF
      </button>

      {/* A4 Container */}
      {pdfPages.map((page) => (
        <div
          key={page.id}
          id={page.id}
          className="h-[1123px] w-[794px] bg-white p-4 shadow-md"
        >
          <div className="flex h-full w-full flex-col justify-between">
            <HeaderSection
              companyName="Vietcombank"
              currentDate={currentDate}
              closePrice={closePrice}
            />
            <div className="flex-1 overflow-hidden">{page.component}</div>
            <FooterSection />
          </div>
        </div>
      ))}
    </div>
  );
}

const pdfPages = [
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
          Close Price: {closePrice}
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
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/88/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_kinh_t%E1%BA%BF_-_Lu%E1%BA%ADt_%28UEL%29%2C_%C4%90HQG-HCM%2C_220px.png"
        className="h-full w-full"
      />
    </div>
  </div>
);
