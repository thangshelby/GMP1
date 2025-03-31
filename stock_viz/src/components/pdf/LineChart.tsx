import { StockPriceDataType } from "@/types";
import { Line } from "react-chartjs-2";
import { subMonths, format } from "date-fns";
import { fetchAPI } from "@/lib/utils";
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
import { useEffect, useState } from "react";

// Đăng ký các thành phần của Chart.js
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

  useEffect(() => {
    if (!symbol) return; // Tránh fetch khi symbol không hợp lệ

    let start_date =
      duration === "6 Months"
        ? format(subMonths(new Date(), 7), "yyyy-MM-dd")
        : "2020-01-01";
    const end_date = format(subMonths(new Date(), 1), "yyyy-MM-dd");
    const interval = duration === "6 Months" ? "1D" : "1W";
    const fetchData = async () => {
      try {
        const result = await fetchAPI(
          `stocks/stock_quote?symbol=${symbol}&start_date=${start_date}&end_date=${end_date}&interval=${interval}`,
        );
        setStockData(result);

        // if (setClosePrice) setClosePrice(result[result.length - 1].Close);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchData();
  }, [symbol, duration]);

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
    // responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 6, // Cỡ chữ
            weight: "bold" as "bold", // Độ đậm
            family: "Arial", // Font chữ
          },
          callback: function (value: any, index: any, values: any) {
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
            weight: "bold" as "bold",
          },
        },
      },
    },
  };

  return (
    <div className="w-[100%] bg-white">
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
