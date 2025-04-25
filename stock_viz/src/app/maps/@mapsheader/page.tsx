"use client";
import React, { useState } from "react";
import { MdFullscreen, MdFullscreenExit, MdBubbleChart } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { TiPlus, TiMinus } from "react-icons/ti";
import { TbChartTreemap } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const MapsHeader = () => {
  const { t } = useTranslation("maps");
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <div className="py1 flex w-full flex-row items-center justify-between bg-[#363a46]">
      {/* Left side - View controls */}
      <div className="flex w-[15%] items-center justify-between border-r border-black px-4">
        <span className="text-sm text-gray-400">VIEW</span>
        <div className="flex gap-1">
          <button className="hover:cur flex items-center gap-1 rounded p-2">
            <TbChartTreemap color="#57aefb" />
            <span className="text-primary text-sm">Tree Map</span>
          </button>
          <button className="hover:cur flex items-center gap-1 rounded p-2">
            <MdBubbleChart color="white" />
            <span className="text-sm text-white">Bubbles</span>
          </button>
        </div>
      </div>

      <div className="flex w-[85%] flex-row items-center justify-between px-4">
        <div className="text-sm text-gray-400">
          {t("MapsHeader.description")}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 rounded p-2 hover:cursor-pointer"
          >
            {isFullscreen ? (
              <MdFullscreenExit color="#57aefb" />
            ) : (
              <MdFullscreen color="#57aefb" />
            )}
            <span className="text-primary text-sm">{t("MapsHeader.reset")}</span>
          </button>
          <button className="flex items-center gap-1 rounded p-2 hover:cursor-pointer">
            <CiShare2 color="#57aefb" />
            <span className="text-primary text-sm">{t("MapsHeader.share")}</span>
          </button>
          <button className="rounded p-2 hover:cursor-pointer" title={t("MapsHeader.zoomOut")}>
            <TiMinus color="#57aefb" />
          </button>
          <button className="rounded p-2 hover:cursor-pointer" title={t("MapsHeader.zoomIn")}>
            <TiPlus color="#57aefb" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapsHeader;
