import { ChartControl, Chart, ChartInformation } from "@/components";

const StockChartContainer = () => {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <div className="border-secondary mt-6 w-[90%] overflow-hidden rounded-md border bg-[#22262f]">
        <ChartControl />

        <ChartInformation />

        <Chart />
      </div>
    </div>
  );
};

export default StockChartContainer;
