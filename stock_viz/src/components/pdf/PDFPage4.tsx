"use client";
import React from "react";
import { usePdfStore } from "@/store";
import { useSearchParams } from "next/navigation";
import BubbleChart from "./charts/BubbleChart";
import { getFinalAnalysis } from "@/apis/report";
import { useQuery } from "@tanstack/react-query";

const PDFPage4 = () => {
  const symbol = useSearchParams().get("symbol") || "VCB";

  const { financialData, businessData, setCanCreatePdf } = usePdfStore();

  const [finalAnalysis, setFinalAnalysis] = React.useState<string>("");

  const result = useQuery({
    queryKey: ["final-analysis", symbol],
    queryFn: () => getFinalAnalysis(symbol, financialData, businessData),
  });

  React.useEffect(() => {
    if (result.isLoading) return;
    setCanCreatePdf(true);
    setFinalAnalysis(result.data);
  }, [result.data, setCanCreatePdf, result.isLoading]);

  return (
    finalAnalysis && (
      <div id="pdf-container">
        {/* BODY */}
        <div className="flex h-full flex-col space-y-12 py-6">
          {/* CHART */}
          <BubbleChart />

          {/* FINAL ANALYSIS */}
          <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
            <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
              FINAL ANALYSIS
            </h2>
            <p className="text-xs text-black">{finalAnalysis}</p>
          </div>

          {/* DISCLAIMER */}
          <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
            <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
              Disclaimer
            </h2>
            <p className="text-xs text-black">{nhanxet2}</p>
          </div>
        </div>
      </div>
    )
  );
};

export default PDFPage4;

const nhanxet2 =
  "The information, statements and projections contained in this report, including personal opinions, are based on sources believed to be reliable, but the Group does not guarantee the accuracy or completeness of such sources of information. The opinions contained in this report are based on detailed and careful analysis and, in our opinion, are reasonable at the time of publication. The opinions contained in this report are subject to change at any time without notice. This report should not be construed as an offer to buy or sell any securities. The Group and its subsidiaries, as well as their directors and employees, may have interests in companies mentioned in this report. The Group may have provided, is providing, or will continue to provide services to the companies mentioned in this report. The Group shall not be liable for any or all damages or alleged damages resulting from the use of all or any information or opinions contained in this report. The Group strictly prohibits the use, and any printing, copying or publication of the Report in whole or in part for any purpose without the Groups prior written consent.";
