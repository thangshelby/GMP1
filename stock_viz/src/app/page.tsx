import { Suspense } from "react";
import { StockTable, Treemap } from "@/components";
import OverviewMarketChartContainer from "@/components/home/OverviewMarketChartContainer";
import OverviewIndicatorMarket from "@/components/home/OverviewIndicatorMarket";

export default async function Home() {
  return (
    <div className="flex flex-col ">
      <OverviewMarketChartContainer />
      <OverviewIndicatorMarket />

      <div className="flex flex-row justify-between py-6">
        <div className="w-[32%]">
          <Suspense fallback={<LoadingTable />}>
            <StockTable />
          </Suspense>
        </div>

        <div className="w-[32%]">
          <Suspense fallback={<LoadingTable />}>
            <StockTable />
          </Suspense>
        </div>

        <div className="w-[32%]">
          <Suspense fallback={<LoadingTable />}>
            <Treemap />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function LoadingTable() {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}
