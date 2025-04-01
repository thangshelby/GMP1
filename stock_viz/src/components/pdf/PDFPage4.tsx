"use client";

import React from "react";
import { usePdfStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/utils";
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

interface BubleDataType {
  assets_values: number[];
  labels: string[];
  roe_values: number[];
}
const PDFPage4 = () => {
  const symbol = useSearchParams().get("symbol") || "VCB";

  const { financialData, businessData, setCanCreatePdf } = usePdfStore();
  const [bubbleData, setBubbleData] = React.useState<BubleDataType>({
    assets_values: [],
    labels: [],
    roe_values: [],
  });

  const [overallFinancialData, setOverallFinancialData] =
    React.useState<OverallFinancialDataType>(data);
  const [finalAnalysis, setFinalAnalysis] = React.useState<string>("");
  const chartRef = React.useRef<any>(null);
  const [chartSize, setChartSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `/reports/financial/chart/bar_and_line?symbol=${symbol}`,
      );
      const response2 = await fetchAPI(
        `/reports/financial/final_analysis?symbol=${symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ financialData, businessData }),
        },
      );
      setCanCreatePdf(true);
      setFinalAnalysis(response2);
      setBubbleData(response.res2);
      setOverallFinancialData(response.res1);
    };
    const updateSize = () => {
      setChartSize({
        width: chartRef.current.clientWidth,
        height: chartRef.current.clientHeight,
      });
    };
    if (chartRef.current) {
      updateSize();
    }
    if (bubbleData.assets_values.length==0) {
      fetchData();  
    }
  }, [chartRef.current]);
  React.useEffect(() => {}, []);

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

  return (
    overallFinancialData && (
      <div id="pdf-container">
        {/* BODY */}
        <div className="flex h-full flex-col justify-between">
          {/* CHART */}
          <div ref={chartRef} className="flex flex-row">
            {chartSize.width > 0 && (
              <Bubble
                width={chartSize.width}
                height={Math.floor(chartSize.width / 2)}
                data={data2}
                options={options2}
              />
            )}
            {/* <Chart type="bar" data={chartData} options={options} /> */}
          </div>

          {/* FINAL ANALYSIS */}
          <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
            <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
              FINAL ANALYSIS
            </h2>
            <div className="prose prose-2xl markdown-content">
              <p className="text-xs text-black">{nhanxet}</p>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="border-t-blue flex-1 rounded border-t-[2px] bg-white">
            <h2 className="border-b-gray text-blue border-b-[1px] border-dashed py-[2px] text-xs font-medium uppercase">
              Disclaimer
            </h2>
            <div className="prose prose-2xl markdown-content">
              <p className="text-xs text-black">{tuyenbo}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default PDFPage4;
const data: OverallFinancialDataType = {
  years: [2020, 2021, 2022, 2023, 2024],
  total_assets: [500000, 600000, 700000, 800000, 900000],
  liabilities: [300000, 350000, 400000, 450000, 500000],
  equity: [200000, 250000, 300000, 350000, 400000],
  ebitda: [150000, 180000, 200000, 250000, 280000],
  net_income_after_taxes: [20000, 25000, 30000, 40000, 50000],
};

interface OverallFinancialDataType {
  years: number[];
  total_assets: number[];
  liabilities: number[];
  equity: number[];
  ebitda: number[];
  net_income_after_taxes: number[];
}

const tuyenbo =
  "Các thông tin, tuyên bố, dự đoán trong bản báo cáo này, bao gồm cả các nhận định cá nhân, là dựa trên các nguồn thông tin tin cậy, tuy nhiên Nhóm không đảm bảo sự chính xác và đầy đủ của các nguồn thông tin này. Các nhận định trong bản báo cáo này được đưa ra dựa trên cơ sở phân tích chi tiết và cẩn thận, theo đánh giá chủ quan của chúng tôi, là hợp lý trong thời điểm đưa ra báo cáo. Các nhận định trong báo cáo này có thể thay đổi bất kì lúc nào mà không báo trước. Báo cáo này không nên được diễn giải như một đề nghị mua hay bán bất cứ một cổ phiếu nào. Nhóm và các công ty con, cũng như giám đốc, nhân viên của Nhóm và các công ty con có thể có lợi ích trong các công ty được đề cập tới trong báo cáo này. Nhóm có thể đã, đang và sẽ tiếp tục cung cấp dịch vụ cho các công ty được đề cập tới trong báo cáo này.Nhóm sẽ không chịu trách nhiệm đối với tất cả hay bất kỳ thiệt hại nào hay sự kiện bị coi là thiệt hại đối với việc sử dụng toàn bộ hay bất kỳ thông tin hoặc ý kiến nào của báo cáo này. Nhóm nghiêm cấm việc sử dụng, và mọi sự in ấn, sao chép hay xuất bản toàn bộ hay từng phần bản Báo cáo này vì bất kỳ mục đích gì mà không có sự chấp thuận của Nhóm.";
const nhanxet =
  'Based on the financial and business data provided for Hoa Phat Group (HPG), a mixed picture emerges for potential investors. The company exhibits growth, indicated by increasing total assets and equity. Its core steel manufacturing operations, from mining to finished products, solidify its position in the Vietnamese steel industry. However, revenue fluctuations impact operating and net income, highlighting sensitivity to market conditions. Profitability metrics like ROE and ROA show variability, suggesting inconsistent efficiency in utilizing equity and assets. The relatively stable and low Long Term Debt/Equity ratio indicates a conservative approach to long-term financing. Analyst outlook leans towards "Sell," which warrants careful consideration. HPG\'s strategic focus on technological innovation and capacity expansion aims to maintain its leading position. However, financial performance is significantly influenced by steel price fluctuations and demand in the construction and manufacturing sectors. Given these factors, a cautious approach is advised, weighing the growth potential against market volatility and analyst recommendations.\n';

// const chartData = {
//   labels: overallFinancialData.years,
//   datasets: [
//     {
//       type: "bar" as const,
//       label: "Total Assets",
//       backgroundColor: "rgba(54, 162, 235, 0.7)",
//       data: overallFinancialData.total_assets,
//     },
//     {
//       type: "bar" as const,
//       label: "Total Liabilities",
//       backgroundColor: "rgba(255, 99, 132, 0.7)",
//       data: overallFinancialData.liabilities,
//     },
//     {
//       type: "bar" as const,
//       label: "Equity",
//       backgroundColor: "rgba(75, 192, 192, 0.7)",
//       data: overallFinancialData.equity,
//     },

//     {
//       type: "line" as const,
//       label: "Net Income After Taxes",
//       borderColor: "rgba(153, 102, 255, 1)",
//       backgroundColor: "rgba(153, 102, 255, 0.5)",
//       fill: false,
//       data: overallFinancialData.net_income_after_taxes,
//       yAxisID: "y1",
//     },
//   ],
// };

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       display: true,
//       position: "top" as const,
//       labels: {
//         font: {
//           size: 10,
//         },
//       },
//     },
//     title: {
//       display: true,
//       text: "Tổng Quan Tình Hình Tài Chính - Công Ty",
//       font: {
//         size: 12,
//       },
//     },
//   },
//   scales: {
//     y: {
//       beginAtZero: true,
//       title: {
//         display: true,
//         text: "Giá trị (Tỷ VND)",
//         font: {
//           size: 10,
//         },
//       },
//     },
//     y1: {
//       beginAtZero: true,
//       position: "right" as const,
//       title: {
//         display: true,
//         text: "Revenue & Net Income (Tỷ VND)",
//         font: {
//           size: 10,
//         },
//       },
//       grid: {
//         drawOnChartArea: false,
//       },
//     },
//   },
// };
