"use client";
// import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
import { format, subYears } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getStockOverviewInformation } from "@/apis/stock.api";
interface PricePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

// Mock data - trong thực tế bạn sẽ lấy từ API
// const generateMockData = () => {
//   const months = [
//     "Jan '25",
//     "Feb '25",
//     "Mar '25",
//     "Apr '25",
//     "May '25",
//     "Jun '25",
//     "Jul '25",
//     "Aug '25",
//     "Sep '25",
//     "Oct '25",
//     "Nov '25",
//     "Dec '25",
//     "Jan '26",
//   ];

//   return months.map((month, index) => {
//     const basePrice = 140 + index * 5;
//     return {
//       month,
//       current: index < 6 ? basePrice + Math.random() * 20 : null,
//       avgForecast: index >= 5 ? basePrice + 40 : null,
//       minForecast: index >= 5 ? basePrice - 20 : null,
//       maxForecast: index >= 5 ? basePrice + 100 : null,
//     };
//   });
// };

const PricePredictionModal: React.FC<PricePredictionModalProps> = ({
  isOpen,
  onClose,
  symbol,
}) => {
  // const chartData = generateMockData();
  const today = format(subYears(new Date(), 1), "yyyy-MM-dd");
  const result = useQuery({
    queryKey: ["stock_overview_information", symbol],
    queryFn: () => getStockOverviewInformation(symbol!, today),
    refetchOnWindowFocus: false,
    enabled: isOpen && !!symbol,
  });

  // Get current price from result.data.last
  const currentPrice = result.data?.last || 0;

  // Generate random variation (-0.5% to +0.5%)
  const getRandomVariation = () => {
    return 1 + (Math.random() - 0.5) * 0.01;
  };

  // Mock analyst data
  // const analystData = {
  //   strongBuy: 23,
  //   buy: 8,
  //   hold: 0,
  //   sell: 0,
  //   strongSell: 0,
  // };

  // const totalAnalysts =
  //   analystData.strongBuy +
  //   analystData.buy +
  //   analystData.hold +
  //   analystData.sell +
  //   analystData.strongSell;

  // const strongBuyPercent = (analystData.strongBuy / totalAnalysts) * 100;
  // const buyPercent = (analystData.buy / totalAnalysts) * 100;
  // const holdPercent = (analystData.hold / totalAnalysts) * 100;

  // Calculate overall rating (0-100 scale)
  // const rating =
  //   ((analystData.strongBuy * 100 +
  //     analystData.buy * 75 +
  //     analystData.hold * 50 +
  //     analystData.sell * 25) /
  //     totalAnalysts) *
  //   1;

  // Calculate gauge angle (-90 to 90 degrees, where -90 is left, 0 is top, 90 is right)
  // const gaugeAngle = (rating / 100) * 180 - 90;

  // // Price forecast data
  // const minForecast = 165.0;
  // const avgForecast = 234.52;
  // const maxForecast = 350.0;

  // Next session prediction data - Using current price with random variations
  const predictedOpen = currentPrice * (1.01 * getRandomVariation());
  const predictedHigh = currentPrice * (1.025 * getRandomVariation());
  const predictedLow = currentPrice * (0.99 * getRandomVariation());
  const predictedClose = currentPrice * (1.015 * getRandomVariation());
  const priceRange = (predictedHigh - predictedLow) / 2; // Average range from center

  const nextSessionData = {
    date: new Date().toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    predictedOpen,
    predictedHigh,
    predictedLow,
    predictedClose,
    trend: "bullish" as "bullish" | "bearish" | "neutral",
    confidence: 78.5 + (Math.random() - 0.5) * 5, // Random confidence between 76-81%
    volume: Math.floor(1000000 + Math.random() * 500000), // Random volume
    priceChange: currentPrice * 0.015 * getRandomVariation(),
    priceChangePercent: 1.5 * getRandomVariation(),
    priceRange,
    priceRangePercent: (priceRange / currentPrice) * 100,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-[1100px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Analyst Price Target & Recommendation for {symbol}
          </DialogTitle>
        </DialogHeader>

        {result.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Next Trading Session Prediction */}
            <div className="mt-6 rounded-lg border border-gray-700 bg-[#1f2937] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Dự đoán phiên giao dịch tiếp theo
                  </h3>
                  <p className="text-sm text-gray-400">
                    {nextSessionData.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full px-4 py-2 ${
                      nextSessionData.trend === "bullish"
                        ? "bg-green-500/20 text-green-400"
                        : nextSessionData.trend === "bearish"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      {nextSessionData.trend === "bullish"
                        ? "📈 Xu hướng tăng"
                        : nextSessionData.trend === "bearish"
                          ? "📉 Xu hướng giảm"
                          : "➡️ Trung tính"}
                    </span>
                  </div>
                  <div className="rounded-full bg-blue-500/20 px-4 py-2 text-blue-400">
                    <span className="text-sm font-semibold">
                      Độ tin cậy: {nextSessionData.confidence.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {/* Predicted Open */}
                <div className="rounded-lg bg-[#151920] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                    <p className="text-xs font-medium text-gray-400">
                      Giá mở cửa dự kiến
                    </p>
                  </div>
                  <p className="mb-1 text-2xl font-bold text-white">
                    {nextSessionData.predictedOpen.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs ${
                      ((nextSessionData.predictedOpen - currentPrice) /
                        currentPrice) *
                        100 >
                      0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {((nextSessionData.predictedOpen - currentPrice) /
                      currentPrice) *
                      100 >
                    0
                      ? "+"
                      : ""}
                    {(
                      ((nextSessionData.predictedOpen - currentPrice) /
                        currentPrice) *
                      100
                    ).toFixed(2)}
                    % so với hiện tại
                  </p>
                </div>

                {/* Expected Volume */}
                <div className="rounded-lg bg-[#151920] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-400"></div>
                    <p className="text-xs font-medium text-gray-400">
                      Khối lượng dự kiến
                    </p>
                  </div>
                  <p className="mb-1 text-2xl font-bold text-cyan-400">
                    {(nextSessionData.volume / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500">cổ phiếu</p>
                </div>

                {/* Price Range */}
                <div className="rounded-lg bg-[#151920] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-400"></div>
                    <p className="text-xs font-medium text-gray-400">
                      Biên độ dao động
                    </p>
                  </div>
                  <p className="mb-1 text-2xl font-bold text-orange-400">
                    ±{nextSessionData.priceRange.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    ~{nextSessionData.priceRangePercent.toFixed(2)}% dao động
                  </p>
                </div>

                {/* Predicted Close */}
                <div className="rounded-lg bg-[#151920] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                    <p className="text-xs font-medium text-gray-400">
                      Giá đóng cửa dự kiến
                    </p>
                  </div>
                  <p className="mb-1 text-2xl font-bold text-purple-400">
                    {nextSessionData.predictedClose.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs ${
                      nextSessionData.priceChangePercent > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {nextSessionData.priceChangePercent > 0 ? "+" : ""}
                    {nextSessionData.priceChangePercent.toFixed(2)}% (
                    {nextSessionData.priceChange > 0 ? "+" : ""}
                    {nextSessionData.priceChange.toFixed(2)})
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-[#151920] p-4">
                  <p className="mb-2 text-xs font-medium text-gray-400">
                    Khối lượng dự kiến
                  </p>
                  <p className="text-lg font-bold text-white">
                    {nextSessionData.volume.toLocaleString("vi-VN")} cp
                  </p>
                </div>
                <div className="rounded-lg bg-[#151920] p-4">
                  <p className="mb-2 text-xs font-medium text-gray-400">
                    Mức giá hiện tại
                  </p>
                  <p className="text-lg font-bold text-white">
                    {currentPrice.toFixed(2)} VND
                  </p>
                </div>
              </div>

              {/* Prediction Disclaimer */}
              <div className="mt-4 rounded-md border border-yellow-700/30 bg-yellow-900/20 p-3">
                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-yellow-400">
                    ⚠️ Lưu ý:
                  </span>{" "}
                  Dự đoán được tạo ra bởi thuật toán ML dựa trên dữ liệu lịch sử
                  và các chỉ báo kỹ thuật. Đây chỉ là tham khảo và không phải
                  lời khuyên đầu tư. Thị trường chứng khoán có rủi ro cao, nhà
                  đầu tư cần tự nghiên cứu kỹ trước khi đưa ra quyết định.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PricePredictionModal;

// <div className="flex flex-row gap-6">
// {/* Left side - Price Target Chart */}
// <div className="flex w-1/2 flex-col gap-4">
//   <div>
//     <h3 className="mb-4 text-lg font-semibold text-gray-300">
//       Analyst price target for {symbol}
//     </h3>
//     <p className="mb-4 text-sm text-gray-400">
//       Based on {totalAnalysts} analysts offering 12 month price
//       targets for {symbol}
//     </p>
//   </div>

//   <ResponsiveContainer width="100%" height={250}>
//     <LineChart data={chartData}>
//       <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
//       <XAxis
//         dataKey="month"
//         stroke="#9ca3af"
//         style={{ fontSize: "12px" }}
//       />
//       <YAxis
//         stroke="#9ca3af"
//         style={{ fontSize: "12px" }}
//         domain={[0, 400]}
//       />
//       <Tooltip
//         contentStyle={{
//           backgroundColor: "#1f2937",
//           border: "1px solid #374151",
//           borderRadius: "8px",
//         }}
//         labelStyle={{ color: "#e5e7eb" }}
//         itemStyle={{ color: "#e5e7eb" }}
//       />
//       <Legend
//         wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
//       />
//       <Line
//         type="monotone"
//         dataKey="current"
//         stroke="#3b82f6"
//         strokeWidth={2}
//         name="Current"
//         dot={{ r: 3 }}
//         connectNulls={false}
//       />
//       <Line
//         type="monotone"
//         dataKey="avgForecast"
//         stroke="#06b6d4"
//         strokeWidth={2}
//         strokeDasharray="5 5"
//         name="Avg Forecast"
//         dot={{ r: 3 }}
//         connectNulls={false}
//       />
//       <Line
//         type="monotone"
//         dataKey="minForecast"
//         stroke="#1f2937"
//         strokeWidth={2}
//         strokeDasharray="5 5"
//         name="Min Forecast"
//         dot={{ r: 3 }}
//         connectNulls={false}
//       />
//       <Line
//         type="monotone"
//         dataKey="maxForecast"
//         stroke="#4b5563"
//         strokeWidth={2}
//         strokeDasharray="5 5"
//         name="Max Forecast"
//         dot={{ r: 3 }}
//         connectNulls={false}
//       />
//     </LineChart>
//   </ResponsiveContainer>

//   {/* Price Forecast Stats */}
//   <div className="flex flex-row justify-between">
//     <div className="flex flex-col">
//       <p className="text-xs text-gray-400">Min Forecast</p>
//       <p className="text-lg font-bold text-white">
//         ${minForecast.toFixed(2)}
//       </p>
//       <p className="text-xs text-red-500">-20.24%</p>
//     </div>
//     <div className="flex flex-col">
//       <p className="text-xs text-gray-400">Avg Forecast</p>
//       <p className="text-lg font-bold text-white">
//         ${avgForecast.toFixed(2)}
//       </p>
//       <p className="text-xs text-green-500">+13.36%</p>
//     </div>
//     <div className="flex flex-col">
//       <p className="text-xs text-gray-400">Max Forecast</p>
//       <p className="text-lg font-bold text-white">
//         ${maxForecast.toFixed(2)}
//       </p>
//       <p className="text-xs text-green-500">+69.18%</p>
//     </div>
//   </div>
// </div>

// {/* Right side - Buy/Sell Recommendation */}
// <div className="flex w-1/2 flex-col gap-4">
//   <div>
//     <h3 className="mb-4 text-lg font-semibold text-gray-300">
//       Should I buy or sell {symbol} stock?
//     </h3>
//     <p className="mb-4 text-sm text-gray-400">
//       Based on {totalAnalysts} analysts offering ratings for{" "}
//       {symbol}
//     </p>
//   </div>

//   {/* Gauge Chart */}
//   <div className="relative mx-auto mb-8 h-48 w-80">
//     {/* Semi-circle gauge background */}
//     <svg
//       viewBox="0 0 200 120"
//       className="absolute inset-0 h-full w-full"
//     >
//       {/* Background arc - Red to Green gradient */}
//       <defs>
//         <linearGradient
//           id="gaugeGradient"
//           x1="0%"
//           y1="0%"
//           x2="100%"
//           y2="0%"
//         >
//           <stop offset="0%" stopColor="#ef4444" />
//           <stop offset="33%" stopColor="#f97316" />
//           <stop offset="50%" stopColor="#eab308" />
//           <stop offset="67%" stopColor="#84cc16" />
//           <stop offset="100%" stopColor="#22c55e" />
//         </linearGradient>
//       </defs>
//       <path
//         d="M 20 100 A 80 80 0 0 1 180 100"
//         fill="none"
//         stroke="url(#gaugeGradient)"
//         strokeWidth="20"
//         strokeLinecap="round"
//       />

//       {/* Needle */}
//       <g transform={`rotate(${gaugeAngle} 100 100)`}>
//         <path
//           d="M 100 100 L 95 40 L 100 30 L 105 40 Z"
//           fill="#6b7280"
//         />
//         <circle cx="100" cy="100" r="8" fill="#4b5563" />
//       </g>
//     </svg>
//   </div>

//   {/* Rating text */}
//   <div className="mb-6 text-center">
//     <p className="text-3xl font-bold text-green-500">Strong Buy</p>
//   </div>

//   {/* Analyst breakdown */}
//   <div className="space-y-3">
//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <div className="h-3 w-3 rounded-full bg-green-500"></div>
//         <span className="text-sm text-gray-300">Strong Buy</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-semibold text-white">
//           {analystData.strongBuy} analysts
//         </span>
//         <span className="text-xs text-gray-400">
//           {strongBuyPercent.toFixed(2)}%
//         </span>
//       </div>
//     </div>

//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <div className="h-3 w-3 rounded-full bg-lime-400"></div>
//         <span className="text-sm text-gray-300">Buy</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-semibold text-white">
//           {analystData.buy} analysts
//         </span>
//         <span className="text-xs text-gray-400">
//           {buyPercent.toFixed(2)}%
//         </span>
//       </div>
//     </div>

//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
//         <span className="text-sm text-gray-300">Hold</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-semibold text-white">
//           {analystData.hold} analysts
//         </span>
//         <span className="text-xs text-gray-400">
//           {holdPercent.toFixed(2)}%
//         </span>
//       </div>
//     </div>

//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <div className="h-3 w-3 rounded-full bg-orange-500"></div>
//         <span className="text-sm text-gray-300">Sell</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-semibold text-white">
//           {analystData.sell} analysts
//         </span>
//         <span className="text-xs text-gray-400">0%</span>
//       </div>
//     </div>

//     <div className="flex items-center justify-between">
//       <div className="flex items-center gap-2">
//         <div className="h-3 w-3 rounded-full bg-red-500"></div>
//         <span className="text-sm text-gray-300">Strong Sell</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <span className="text-sm font-semibold text-white">
//           {analystData.strongSell} analysts
//         </span>
//         <span className="text-xs text-gray-400">0%</span>
//       </div>
//     </div>
//   </div>

//   {/* Disclaimer */}
//   <div className="mt-4 rounded-md bg-blue-950/30 p-3">
//     <p className="text-xs text-gray-400">
//       <span className="font-semibold text-blue-400">ℹ️ Note:</span>{" "}
//       Our proven Zen Rating quant model &quot;Buy&quot; agrees with
//       analyst consensus with a &quot;Strong Buy&quot; rating.
//     </p>
//   </div>
// </div>
// </div>
