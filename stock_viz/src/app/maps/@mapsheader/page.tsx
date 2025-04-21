'use client'
import React, { useState } from "react";

import { MdFullscreen, MdFullscreenExit, MdBubbleChart } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { TiPlus, TiMinus } from "react-icons/ti";
import { TbChartTreemap } from "react-icons/tb";
const MapsHeader = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  return (
    <div className="flex w-full flex-row items-center justify-between bg-[#363a46] py1">
      {/* Left side - View controls */}
      <div className="flex w-[20%] items-center justify-between  border-r  border-black px-4">
        <span className="text-sm text-gray-400">VIEW</span>
        <div className="flex gap-1">
          <button className="hover:cur flex items-center gap-1 rounded p-2">
            <TbChartTreemap color="#57aefb" />
            <span className="text-sm text-primary">Tree Map</span>
          </button>
          <button className="hover:cur flex items-center gap-1 rounded p-2">
            <MdBubbleChart color="white" />
            <span className="text-sm text-white">Bubbles</span>
          </button>
        </div>
      </div>

      <div className="flex w-[80%] flex-row items-center justify-between px-4">
        <div className="text-sm text-gray-400">
          Standard and Poors 500 index stocks categorized by sectors and
          industries. Size represents market cap.
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center gap-2">
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="flex items-center gap-1 rounded p-2 hover:cursor-pointer">
            {isFullscreen ? (
              <MdFullscreenExit color="#57aefb" />
            ) : (
              <MdFullscreen color="#57aefb" />
            )}
            <span className="text-primary text-sm">Fullscreen</span>
          </button>
          <button className="hover:cur flex items-center gap-1 rounded p-2">
            <CiShare2 color="#57aefb" />

            <span className="text-primary text-sm"> Share map</span>
          </button>
          <button className="hover:cur rounded p-2">
            <TiMinus color="#57aefb" />
          </button>
          <button className="hover:cur rounded p-2">
            <TiPlus color="#57aefb" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapsHeader;
