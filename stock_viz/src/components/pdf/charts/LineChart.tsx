import { StockPriceDataType } from "@/types";
import { Line } from "react-chartjs-2";
import { subMonths, format } from "date-fns";
import { useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStockQuote } from "@/apis/stock.api";
ChartJS.register(
  CategoryScale,
  LinearScale,
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
      ? format(subMonths(new Date(), 7), "yyyy-MM-dd")
      : "2020-01-01";
  const end_date = format(subMonths(new Date(), 1), "yyyy-MM-dd");
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
  }, [
    result.data,
    result.isSuccess,
    setStockData,
    setChartSize,
  ]);

  const labels = stockData.map((data) => data.date!);
  const values = stockData.map((data) => data.close);

  const data = {
    labels,
    datasets: [
      {
        label: `Stock Price of ${symbol} in ${duration}`,
        data: values,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(0, 128, 128, 0.5)",
        tension: 1,
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };
  let lastMonth: number | null = null;

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to use custom width/height
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 6, // Cỡ chữ
            weight: "bold" as const, // Độ đậm
            family: "Arial", // Font chữ
          },
          callback: function (value: string, index: number) {
            const date = new Date(labels[index]);
            const year = date.getFullYear();
            const month = date.getMonth();
            const day = date.getDate();

            if (duration === "6 Months") {
              if (lastMonth !== month && month != 7) {
                lastMonth = month;
                return format(new Date(2000, month), "MM");
              }
              return null;
            }
            if (month === 11 && day >= 25) {
              return year;
            }
            return null;
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 8,
            weight: "bold" as const,
          },
        },
      },
    },
  };

  return (
    <div ref={lineChartRef} className="w-[100%] bg-white">
      {chartSize.width > 0 && (
        <Line
          width={chartSize.width}
          height={chartSize.height}
          data={data}
          options={{
            ...options,
            scales: {
              x: {
                type: 'timeseries',
                ticks: {
                  font: {
                    size: 6,
                    weight: "bold",
                    family: "Arial",
                  },
                  callback: function(this, value: string | number, index: number) {
                    const date = new Date(labels[index]);
                    const year = date.getFullYear();
                    const month = date.getMonth(); 
                    const day = date.getDate();

                    if (duration === "6 Months") {
                      if (lastMonth !== month && month != 7) {
                        lastMonth = month;
                        return format(new Date(2000, month), "MM");
                      }
                      return null;
                    }
                    if (month === 11 && day >= 25) {
                      return year;
                    }
                    return null;
                  }
                }
              },
              y: options.scales.y
            }
          }}
        />
      )}
    </div>
  );
};

export default LineChart;
