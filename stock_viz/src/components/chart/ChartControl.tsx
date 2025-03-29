"use client";
import { FaPenNib, FaRegLightbulb } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { option3, option4, dateFilter, indicatorFilter } from "@/constants";
import { useCanCreatePdfStore, useChartControlStore } from "@/store";
import { FaFilePdf } from "react-icons/fa6";
import React from "react";

const ChartControl = () => {
  const [isOpenSelectChart, setIsOpenSelectChart] = React.useState(false);
  const [isOpenIndicatorFilter, setIsOpenIndicatorFilter] =
    React.useState(false);
  const {
    setSelectedChart,
    selectedChart,
    selectedIndicators,
    setSelectedIndicators,
    setInterval,
    interval,
  } = useChartControlStore();

  const { canCreatePdf, setCanCreatePdf } = useCanCreatePdfStore();

  const generatePDF = () => {};
  return (
    <div className="relative flex flex-col px-4 py-2">
      <div className="flex flex-row items-center justify-between">
        {/* 2 BUTTON */}
        <div className="flex flex-row items-center gap-x-2">
          <div className="bg-button text-md flex flex-row items-center gap-x-2 rounded-md px-2 py-1 text-white">
            <FaPenNib size={10} />
            <p className="text-sm font-semibold">Draw</p>
          </div>
          <div className="bg-button text-md flex flex-row items-center gap-x-2 rounded-md px-2 py-1 text-white">
            <FaRegLightbulb size={10} />
            <p className="text-sm font-semibold">Idea</p>
          </div>
        </div>

        {/* CHART AND INDICATOR FILTER */}
        <div className="z-40 flex flex-row items-center gap-x-2">
          {/* CHART FILTER */}
          <div
            onClick={() => {
              setIsOpenIndicatorFilter(false);
              setIsOpenSelectChart(!isOpenSelectChart);
            }}
            className={` ${isOpenSelectChart ? "border-primary" : "border-secondary"} relative flex w-32 flex-row items-center gap-x-2 rounded-md border-[0.1rem] bg-[#22262f] px-2 py-1 hover:cursor-pointer`}
          >
            <p className="text-md">{option3[selectedChart].icon}</p>
            <p className="text-2xs w-[100%] truncate font-medium text-white">
              {option3[selectedChart].title}
            </p>
            <IoMdArrowDropdown size={20} color="#e8e9eb" />

            {isOpenSelectChart && (
              <div className="chart-filter absolute top-[120%] left-0 z-50 flex w-36 flex-col rounded-md border-1 p-2 shadow-2xl">
                {option3.map((option, index) => (
                  <div
                    key={option.title}
                    onClick={() => {
                      setSelectedChart(index);
                      setIsOpenSelectChart(false);
                    }}
                    className={`hover:bg-button flex flex-row items-center gap-x-2 rounded-md p-2 font-semibold text-white duration-200 ${selectedChart == index ? "bg-primary" : "bg-[#22262f]"}`}
                  >
                    <p className="text-md">{option.icon}</p>
                    <p className="text-2xs">{option.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INDICATOR FILTER */}
          <div
            onClick={() => {
              setIsOpenSelectChart(false);
              setIsOpenIndicatorFilter(!isOpenIndicatorFilter);
            }}
            className={`chart-filter ${isOpenIndicatorFilter ? "border-primary" : "border-secondary"} relative z-50 flex w-32 flex-row items-center gap-x-2 rounded-md border-[0.1rem] bg-[#22262f] px-2 py-1 hover:cursor-pointer`}
          >
            <p className="w-[100%] truncate text-xs font-medium text-white">
              Indicators
            </p>
            <IoMdArrowDropdown size={20} color="#e8e9eb" />

            {isOpenIndicatorFilter && (
              <div className="chart-filter absolute top-[120%] left-0 z-50 flex w-32 flex-col rounded-md border-[0.1rem] p-[0.4rem] shadow-2xl">
                {indicatorFilter.map((option) => (
                  <div
                    key={option.title}
                    onClick={() => {
                      if (!selectedIndicators.includes(option.title)) {
                        setSelectedIndicators([
                          ...selectedIndicators,
                          option.title,
                        ]);
                      }

                      setIsOpenIndicatorFilter(false);
                    }}
                    className={`hover:bg-button text-2xs flex flex-row items-center gap-x-2 rounded-md bg-[#22262f] p-2 font-semibold text-white duration-200`}
                  >
                    {option.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE FILTER */}
          <div className="flex flex-row items-center">
            {dateFilter.map((option, index) => (
              <p
                onClick={() => {
                  setInterval(option.key);
                }}
                key={option.key}
                className={`text-sm ${interval == option.key ? "border-primary bg-button border-[0.1rem] text-white" : "text-secondary"} hover:bg-button rounded-sm px-2 py-1 text-xs font-semibold duration-200 hover:cursor-pointer`}
              >
                {option.title}
              </p>
            ))}
          </div>
          <div className="bg-button rounded-lg p-2 hover:cursor-pointer">
            <SlCalender size={14} color="#e8e9eb" />
          </div>
        </div>

        <div className="flex flex-row items-center gap-x-2">
          <div
            onClick={
              canCreatePdf
                ? generatePDF
                : (e) => {
                    e.preventDefault();
                  }
            }
            className={`bg-primary text-md flex flex-row items-center gap-x-2 rounded-md px-2 py-1 text-white ${canCreatePdf ? "hover:cursor-pointer hover:bg-blue-600" : "opacity-40 hover:cursor-not-allowed"}`}
          >
            <FaFilePdf size={10} />

            <p className="text-[11px] font-semibold">Generate Free PDF</p>
          </div>

          {option4.map((option, index) => (
            <div
              key={index}
              className={`bg-button text-md flex flex-row items-center gap-x-2 rounded-md px-2 py-1 text-white hover:cursor-pointer`}
            >
              {option.icon}
              {option.title && (
                <p className="text-[11px] font-semibold">{option.title}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartControl;
