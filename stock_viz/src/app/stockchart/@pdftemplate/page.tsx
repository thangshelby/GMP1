"use client";
import React from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { footerContent } from "@/constants";
import { BusinessSummary, FinancialSummary } from "@/components";
export default function PdfTemplate() {
  const generatePDF = async () => {
    const container = document.getElementById("a4-container");

    if (!container) return;

    // Scroll to top to avoid capturing unexpected portions
    window.scrollTo(0, 0);

    const canvas = await html2canvas(container, {
      scale: 2, // Improves quality
      useCORS: true, // Fixes external images
      logging: false, // Reduces console spam
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [794, 1123], // A4 Size in px
    });

    pdf.addImage(imgData, "PNG", 0, 0, 794, 1123);
    pdf.save("document.pdf");
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
      <div
        id="a4-container"
        className="h-[1123px] w-[794px] bg-white p-4 shadow-md"
      >
        <div className="flex h-full w-full flex-col justify-between">
          <HeaderSection />
          <BusinessSummary />
          <FooterSection />
        </div>
      </div>

      <div
        id="a41-container"
        className="h-[1123px] w-[794px] bg-white p-4 shadow-md"
      >
        <div className="flex h-full w-full flex-col justify-between">
          <HeaderSection />
          <FinancialSummary />
          <FooterSection />
        </div>
      </div>
    </div>
  );
}

const pdfPages = [
  {
    title: "Business Summary",
    content: <BusinessSummary />,
  },
  {
    title: "Financial Summary",
    content: <FinancialSummary />,
  },
];

const HeaderSection = () => {
  return (
    <div className="flex flex-row justify-end">
      <div className="flex flex-col items-end">
        <h1 className="text-lg font-bold text-black">VCB</h1>
        <h1 className="text-lg font-semibold text-black">Close Price100</h1>
        <h1 className="text-lg font-normal text-black">Document Date:</h1>
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
