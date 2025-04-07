import React from "react";

const MiniBarChart = ({ data }: { data: number[] }) => {
  const width = 40;
  const height = 20;
  const barWidth = width / data.length;
  const max = Math.max(...data.map(Math.abs)); 

  return (
    <svg width={width} height={height}>
      {data.map((value, index) => {
        const barHeight = (Math.abs(value) / max) * (height / 2); 
        const x = index * barWidth;
        const y = value >= 0 ? height/2 - barHeight : height / 2;
        const fill = value >= 0 ? "#2f91ef" : "#fb5057";

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth - 2} 
            height={barHeight}
            fill={fill}
          />
        );
      })}

      <line x1="0" y1={height / 2} x2={width} y2={height / 2}  />
    </svg>
  );
};

export default MiniBarChart;