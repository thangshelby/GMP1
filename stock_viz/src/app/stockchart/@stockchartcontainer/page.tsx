
import { ChartControl, Chart, ChartInformation } from "@/components";

const StockChartContainer = () => {
  return (
    <div className="flex w-full flex-row items-center justify-center">
      <div className="w-[90%] overflow-hidden rounded-md border-[1px] border-secondary bg-[#22262f] mt-6">
        <ChartControl />

        <ChartInformation />

        <Chart />
      </div>
    </div>
  );
};

export default StockChartContainer;
