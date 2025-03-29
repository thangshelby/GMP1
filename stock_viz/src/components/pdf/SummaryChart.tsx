import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface ChartAssetEquityType {
  years: number[];
  equity: number[];
  total_assets: number[];
}
interface ChartLiabilitiesEquityType {
  years: number[];
  equity: number[];
  liabilities: number[];
}

const SummaryChart = ({ symbol }: { symbol: string }) => {
  const [chartAssetAndEquity, setChartAssetAndEquity] =
    React.useState<ChartAssetEquityType>();
  const [chartLiabilitesAndEquity, setChartLiabilitesAndEquity] =
    React.useState<ChartLiabilitiesEquityType>();

  React.useEffect(() => {
    const fetchData = async () => {
      const response2 = await fetch(
        `http://localhost:5000/reports/financial/chart/asset_equity?symbol=${symbol}`,
      );
      if (!response2.ok) throw new Error("Failed to fetch data");
      const result2 = await response2.json();
      setChartAssetAndEquity(result2.res1);
      setChartLiabilitesAndEquity(result2.res2);
    };

    fetchData();
  },[]);


  const data1 = {
    labels:chartAssetAndEquity?.years ,
    datasets: [
      {
        label: "Total Assets (Tỷ VND)",
        data: chartAssetAndEquity?.total_assets,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Equity (Tỷ VND)",
        data: chartAssetAndEquity?.equity,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderDash: [3,3],
        yAxisID: "y1",
      },
    ],
  };

  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        display:true,
        position: "top" as const,
        labels: {
          font: {
            size: 8, // Set legend font size to 8
          },
        },
      },
      title: {
        display: true,
        text: `Total Assets and Equity Over Time - ${symbol.toUpperCase()}`,
        font: {
          size: 8, // Set title font size to 8
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        position: "left" as const,
        title: {
          display: true,
          text: "Total Assets (Tỷ VND)",
          font: {
            size: 8, // Set Y-axis title font size to 8
          },
        },
        ticks: {
          font: {
            size: 8, // Set Y-axis tick labels font size to 8
          },
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        title: {
          display: true,
          text: "Equity (Tỷ VND)",
          font: {
            size: 8, // Set Y1-axis title font size to 8
          },
        },
        ticks: {
          font: {
            size: 8, // Set Y1-axis tick labels font size to 8
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        ticks: {
          font: {
            size: 8, // Set X-axis tick labels font size to 8
          },
        },
      },
    },
  };
  const data2 = {
    labels:chartLiabilitesAndEquity?.years ,
    datasets: [
      {
        label: "Total Liabilities",
        data: chartLiabilitesAndEquity?.liabilities,
        backgroundColor: "orange",
      },
      {
        label: "Equity",
        data: chartLiabilitesAndEquity?.equity,
        backgroundColor: "green",
      },
    ],
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const ,labels:{font:{size:8}}},
      title: {
        font:{size:8},
        display: true,
        text:`Total Liabilities and Equity (Stacked) - ${symbol.toUpperCase()}`,
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 8,
            weight: "bold" as "bold",
            family: "Arial",
          },
        },
      },
      y: {
        stacked: true,
        title: {
          font: { size: 8 },
          display: true,
          text: "Value (Tỷ VND)",
        },
        ticks: {
          font: {
            size: 8,
            weight: "bold" as "bold",
            family: "Arial",
          },
        },
      },
    },
  };

  return (
    <div className="flex-row flex items-center justify-between space-x-4">
      <div className="w-[270px]">
        <Line data={data1} options={options1} />;
      </div>
      <div className="w-[270px]">
        <Bar data={data2} options={options2} />;
      </div>
    </div>
  );
};

export default SummaryChart;
