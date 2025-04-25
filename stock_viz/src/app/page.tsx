import { StockTable, Treemap } from "@/components";
import OverviewMarketChartContainer from "@/components/home/OverviewMarketChartContainer";
import OverviewIndicatorMarket from "@/components/home/OverviewIndicatorMarket";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <OverviewMarketChartContainer />
      <OverviewIndicatorMarket />

      <div className="relative z-10 flex flex-row gap-2 overflow-visible py-6">
        <StockTable exchange="hose" />

        <StockTable exchange="hnx" />

        <Treemap />
      </div>
    </div>  
  );
}
