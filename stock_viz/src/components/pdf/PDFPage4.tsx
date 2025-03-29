import React from "react";
import { useBusinessDataStore, useFinancialDataStore } from "../store/store";
import { StockInfomationType } from "../type";
import { useClosePriceStore } from "../store/store";
import { footerContent } from "../constant";
import './MarkdownStyles.css'
import remarkGfm from "remark-gfm";
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
import { format, subMonths } from "date-fns";
import { useCanCreatePdfStore } from "../store/store";

interface BubleDataType {
  assets_values: number[];
  labels: string[];
  roe_values: number[];
}
const PDFPage4 = ({
  symbol,
  stockInfo,
}: {
  symbol: string;
  stockInfo: StockInfomationType;
}) => {
  const { financialData } = useFinancialDataStore();
  const { businessData } = useBusinessDataStore();
  const { closePrice } = useClosePriceStore();
  const [bubbleData, setBubbleData] = React.useState<BubleDataType>({
    assets_values: [],
    labels: [],
    roe_values: [],
  });
  const { setCanCreatePdf } = useCanCreatePdfStore();
  const [overallFinancialData, setOverallFinancialData] =
    React.useState<OverallFinancialDataType>(data);
  const [finalAnalysis, setFinalAnalysis] = React.useState<string>("");
  React.useEffect(() => {
    const fetchData = async () => {
  
      const response = await fetch(
        `http://localhost:5000/reports/financial/chart/bar_and_line?symbol=${symbol}`,
      );  
      const response2 = await fetch(
        `http://localhost:5000/reports/financial/final_analysis?symbol=${symbol}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ financialData, businessData }),
        },
      );

      const data = await response.json();
      const data2 = await response2.json();
      setCanCreatePdf(true);
      setFinalAnalysis(data2);
      setBubbleData(data.res2);
      setOverallFinancialData(data.res1);
    };

    fetchData();
  }, []);
  React.useEffect(() => {}, []);

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
      <div className="container mx-auto flex h-[841px] w-[595px] flex-col justify-between bg-white p-8">
        {/*HEADER  */}
        <div className="flex flex-row justify-end">
          <div className="flex flex-col items-end">
            <h1 className="text-lg font-bold">{stockInfo && stockInfo.Name}</h1>
            <h1 className="text-lg font-semibold">
              Close Price: {closePrice && closePrice}{" "}
            </h1>
            <h1 className="text-lg font-normal">
              Document Date: {format(subMonths(new Date(), 1), "yyyy-MM-dd")}
            </h1>
          </div>
        </div>

        {/* BODY */}
        <div className="flex flex-col space-y-4">
          {/* CHART */}
          <div className="flex flex-row">
            <Bubble data={data2} options={options2} />
            {/* <Chart type="bar" data={chartData} options={options} /> */}
          </div>

          {/* FINAL ANALYSIS */}
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
              FINAL ANALYSIS
            </h2>
            <div className="prose prose-2xl markdown-content">
              <p className="text-[9px]">{finalAnalysis||nhanxet}</p>
            </div>
          </div>
          <div className="rounded border-t-[2px] border-blue-500 bg-white">
            <h2 className="border-b-[1px] border-dashed border-b-gray-600 pb-3 text-base font-medium uppercase text-blue-500">
            Disclaimer
            </h2>
            <div className="prose prose-2xl markdown-content">
              <p className="text-[9px]">{tuyenbo}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full flex-row items-center justify-between border-t-[2px] border-gray-500 pt-2">
          <p className="w-[80%] text-[6px] text-gray-500">{footerContent}</p>

          <div className="h-24 w-24">
            <img
              src={
                "https://upload.wikimedia.org/wikipedia/commons/8/88/Logo_Tr%C6%B0%E1%BB%9Dng_%C4%90%E1%BA%A1i_h%E1%BB%8Dc_kinh_t%E1%BA%BF_-_Lu%E1%BA%ADt_%28UEL%29%2C_%C4%90HQG-HCM%2C_220px.png"
              }
              className="h-full w-full"
            />
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


const tuyenbo='Các thông tin, tuyên bố, dự đoán trong bản báo cáo này, bao gồm cả các nhận định cá nhân, là dựa trên các nguồn thông tin tin cậy, tuy nhiên Nhóm không đảm bảo sự chính xác và đầy đủ của các nguồn thông tin này. Các nhận định trong bản báo cáo này được đưa ra dựa trên cơ sở phân tích chi tiết và cẩn thận, theo đánh giá chủ quan của chúng tôi, là hợp lý trong thời điểm đưa ra báo cáo. Các nhận định trong báo cáo này có thể thay đổi bất kì lúc nào mà không báo trước. Báo cáo này không nên được diễn giải như một đề nghị mua hay bán bất cứ một cổ phiếu nào. Nhóm và các công ty con, cũng như giám đốc, nhân viên của Nhóm và các công ty con có thể có lợi ích trong các công ty được đề cập tới trong báo cáo này. Nhóm có thể đã, đang và sẽ tiếp tục cung cấp dịch vụ cho các công ty được đề cập tới trong báo cáo này.Nhóm sẽ không chịu trách nhiệm đối với tất cả hay bất kỳ thiệt hại nào hay sự kiện bị coi là thiệt hại đối với việc sử dụng toàn bộ hay bất kỳ thông tin hoặc ý kiến nào của báo cáo này. Nhóm nghiêm cấm việc sử dụng, và mọi sự in ấn, sao chép hay xuất bản toàn bộ hay từng phần bản Báo cáo này vì bất kỳ mục đích gì mà không có sự chấp thuận của Nhóm.'
const nhanxet="Based on the financial and business data provided for Hoa Phat Group (HPG), a mixed picture emerges for potential investors. The company exhibits growth, indicated by increasing total assets and equity. Its core steel manufacturing operations, from mining to finished products, solidify its position in the Vietnamese steel industry. However, revenue fluctuations impact operating and net income, highlighting sensitivity to market conditions. Profitability metrics like ROE and ROA show variability, suggesting inconsistent efficiency in utilizing equity and assets. The relatively stable and low Long Term Debt/Equity ratio indicates a conservative approach to long-term financing. Analyst outlook leans towards \"Sell,\" which warrants careful consideration. HPG's strategic focus on technological innovation and capacity expansion aims to maintain its leading position. However, financial performance is significantly influenced by steel price fluctuations and demand in the construction and manufacturing sectors. Given these factors, a cautious approach is advised, weighing the growth potential against market volatility and analyst recommendations.\n"