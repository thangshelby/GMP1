"use client";
import React from "react";
import { useChartControlStore } from "@/store";
import { StockPriceDataType } from "@/types";
import { IoMdClose } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
const ChartInformation = () => {
  const { selectedIndicators, currentStockPriceData, setSelectedIndicators } =
    useChartControlStore();

  return (
    <div className="flex flex-col px-4 py-1">
      {/* VISIBLE INDICATOR  */}
      {selectedIndicators.length > 0 && (
        <div className="flex flex-row items-center gap-x-2">
          {selectedIndicators.map((indicator, index) => (
            <div key={index} className="flex flex-row items-center ">
              <p className="text-2xs text-white">{indicator}</p>
              <div className="p-1 hover:cursor-pointer hover:bg-gray-400">
                <FaRegEye size={14} color="#e8e9eb" />
              </div>
              <div
                onClick={() => {
                  setSelectedIndicators(
                    selectedIndicators.filter((item) => item !== indicator),
                  );
                }}
                className="p-1 hover:cursor-pointer hover:bg-gray-400"
              >
                <IoMdClose size={14} color="#e8e9eb" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-secondary flex flex-row items-center space-x-2 text-xs">
        {stockKeyMapValue.map((item) => {
          return (
            <div key={item.key} className="flex flex-row">
              {item.value && <p className="text-white pr-1">{item.value}</p>}

              <p
                className={`pr-1 ${currentStockPriceData.open < currentStockPriceData.close ? "text-[#26a69a]" : "text-[#ef5350]"} ${item.key == "time" && "text-secondary"}`}
              >
                {item.key === "time"
                  ? convertMonth(
                      new Date(
                        currentStockPriceData[item.key] || String(new Date()),
                      ).getMonth(),
                    ) +
                    " " +
                    new Date(currentStockPriceData[item.key] || String(new Date()),).getDate()
                  : ["close", "open", "high", "low"].includes(item.key) &&
                    currentStockPriceData[item.key as keyof StockPriceDataType]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartInformation;

const stockKeyMapValue = [
  {
    key: "time",
  },
  {
    key: "open",
    value: "Open",
  },
  {
    key: "high",
    value: "High",
  },
  {
    key: "low",
    value: "Low",
  },
  {
    key: "close",
    value: "Close",
  },
  // {
  //   key: "volume",
  //   value: "Volume",
  // }
];
const convertMonth = (month: number) => {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
  }
};
