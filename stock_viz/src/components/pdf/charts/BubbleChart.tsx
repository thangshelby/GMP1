"use client";
import React, { useEffect } from "react";
import { fetchAPI } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart, Bubble } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

const BubbleChart = () => {
  const [bubbleData, setBubbleData] = React.useState<BubleDataType>({
    assets_values: [],
    labels: [],
    roe_values: [],
  });

  const [overallFinancialData, setOverallFinancialData] =
    React.useState<OverallFinancialDataType>({
      years: [],
      total_assets: [],
      liabilities: [],
      equity: [],
      ebitda: [],
      net_income_after_taxes: [],
    });
  const [chartSize, setChartSize] = React.useState({ width: 0, height: 0 });
  const symbol = useSearchParams().get("symbol") || "VCB";
  const chartRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchBubbleData = async () => {
      const response = await fetchAPI(
        `/reports/financial/chart/bar_and_line?symbol=${symbol}`,
      );
      setBubbleData(response.res2);
      setOverallFinancialData(response.res1);
    };

    const updateSize = () => {
      setChartSize({
        width: chartRef.current!.clientWidth,
        height: chartRef.current!.clientHeight,
      });
    };
    if (chartRef.current) {
      updateSize();
    }
    if (bubbleData.assets_values.length == 0) {
      fetchBubbleData();
    }
    fetchBubbleData();
  }, []);

  const data2 = {
    labels: bubbleData.labels,

    datasets: [
      {
        label: "Financial Overview",
        data: bubbleData.labels.map((item, index) => {
          return {
            x: bubbleData.assets_values[index],
            y: bubbleData.roe_values[index],
            r: bubbleData.assets_values[index] / 100000,
          };
        }),
        backgroundColor: bubbleData.labels.map((label) =>
          label == symbol.toUpperCase()
            ? "rgba(255, 99, 132, 0.5)"
            : "rgba(75, 192, 192, 0.2)",
        ),
        borderColor: bubbleData.labels.map((label) =>
          label == symbol.toUpperCase()
            ? "rgba(255, 99, 132, 1)"
            : "rgba(75, 192, 192, 1)",
        ),
        borderWidth: 1,
      },
    ],
  };

  const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const index = context.dataIndex;
            return `${data2.labels[index]} - Tài sản: ${context.raw.x} | ROE: ${context.raw.y}%`;
          },
        },
      },
      annotation: {
        annotations: data2.labels.map((label, index) => ({
          type: "label",
          xValue: data2.datasets[0].data[index].x,
          yValue: data2.datasets[0].data[index].y,
          content: label,
          color: "black",
          font: {
            size: 12,
            weight: "bold",
          },
          textAlign: "center",
        })),
      },
    },
  };

  const chartData = {
    labels: overallFinancialData.years,
    datasets: [
      {
        type: "bar" as const,
        label: "Total Assets",
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        data: overallFinancialData.total_assets,
      },
      {
        type: "bar" as const,
        label: "Total Liabilities",
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        data: overallFinancialData.liabilities,
      },
      {
        type: "bar" as const,
        label: "Equity",
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        data: overallFinancialData.equity,
      },

      {
        type: "line" as const,
        label: "Net Income After Taxes",
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        fill: false,
        data: overallFinancialData.net_income_after_taxes,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Tổng Quan Tình Hình Tài Chính - Công Ty",
        font: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Giá trị (Tỷ VND)",
          font: {
            size: 10,
          },
        },
      },
      y1: {
        beginAtZero: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Revenue & Net Income (Tỷ VND)",
          font: {
            size: 10,
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div ref={chartRef} className="flex flex-row">
      {/* {chartSize.width > 0 && (
        <Bubble
          width={chartSize.width}
          height={Math.floor(chartSize.width / 2)}
          data={data2}
          options={options2}
        />
      )} */}
      {chartSize.width > 0 && (
        <Chart
          type="bar"
          width={chartSize.width}
          height={Math.floor(chartSize.width / 2)}
          data={chartData}
          options={options}
        />
      )}
    </div>
  );
};

export default BubbleChart;

interface OverallFinancialDataType {
  years: number[];
  total_assets: number[];
  liabilities: number[];
  equity: number[];
  ebitda: number[];
  net_income_after_taxes: number[];
}
interface BubleDataType {
  assets_values: number[];
  labels: string[];
  roe_values: number[];
}
