import { StockPriceDataType } from "@/types";
import { Line } from "react-chartjs-2";
import { subMonths, subYears, format } from "date-fns";
import { useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
} from "chart.js";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/apis/stock.api";
import "chartjs-adapter-date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeSeriesScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const LineChart = ({ duration }: { duration: string }) => {
  const [stockData, setStockData] = useState<StockPriceDataType[]>([]);
  const symbol = useSearchParams().get("symbol") || "VCB";
  const lineChartRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const start_date =
    duration === "6 Months"
      ? format(subYears(subMonths(new Date(), 7), 1), "yyyy-MM-dd")
      : "2020-01-01";
  const end_date = format(subYears(subMonths(new Date(), 1), 1), "yyyy-MM-dd");

  const interval = duration === "6 Months" ? "1D" : "1W";
  const result = useQuery({
    queryKey: ["stockQuote", symbol, start_date, end_date, interval],
    queryFn: () => getStockQuote(symbol, start_date, end_date, interval),
  });
  useEffect(() => {
    if (!result.data) return;
    setStockData(result.data);

    if (lineChartRef.current) {
      setChartSize({
        width: lineChartRef.current.clientWidth,
        height: lineChartRef.current.clientHeight,
      });
    }
  }, [result.data, result.isSuccess, setStockData, setChartSize]);

  const labels = stockData.map((data) => data.time);

  const values = stockData.map((data) => data.close);

  const data = {
    labels,
    datasets: [
      {
        label: `Stock Price of ${symbol} in ${duration}`,
        data: values,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit:
            duration === "6 Months" ? ("month" as const) : ("year" as const),
          tooltipFormat: "yyyy-MM-dd",
          displayFormats: { month: "MMM yyyy", year: "yyyy" },
        },
        ticks: { font: { size: 8, weight: "bold" as const } },
      },
      y: {
        ticks: { font: { size: 8, weight: "bold" as const } },
      },
    },
  };

  return (
    <div ref={lineChartRef} className="w-fulll bg-white">
      {chartSize.width > 0 && <Line data={data} options={options} />}
    </div>
  );
};

export default LineChart;
