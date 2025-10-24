import { StockTable, Treemap } from "@/components";
import OverviewMarketChartContainer from "@/components/home/OverviewMarketChartContainer";
import OverviewIndicatorMarket from "@/components/home/OverviewIndicatorMarket";

export default async function Home() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col">
      <OverviewMarketChartContainer />
      <OverviewIndicatorMarket />

      <div className="relative z-10 flex h-full flex-row gap-2 overflow-visible py-6">
        <StockTable exchange="hose" />

        <StockTable exchange="hnx" />

        <Treemap />
      </div>
    </div>
  );
}
