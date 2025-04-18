import { StockTable, Treemap } from "@/components";
import OverviewMarketChartContainer from "@/components/home/OverviewMarketChartContainer";
import OverviewIndicatorMarket from "@/components/home/OverviewIndicatorMarket";

export default async function Home() {
  return (
    <div className="flex flex-col">
      <OverviewMarketChartContainer />
      <OverviewIndicatorMarket />

      <div className="flex flex-row py-6 gap-2 overflow-visible relative z-10">
        <StockTable exchange='hose' />

        <StockTable exchange='hnx' />  

        <Treemap  />
      </div>
    </div>
  );
}
