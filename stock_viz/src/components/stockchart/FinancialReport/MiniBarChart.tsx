import React from "react";

const MiniBarChart = ({ data }: { data: number[] }) => {
  const width = 40;
  const height = 20;

  // Filter out NaN, null, undefined values and ensure we have valid data
  const validData = data.filter(
    (value) => typeof value === "number" && !isNaN(value) && isFinite(value),
  );

  // If no valid data, return empty chart
  if (validData.length === 0) {
    return (
      <svg width={width} height={height}>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#666" />
      </svg>
    );
  }

  const barWidth = width / validData.length;
  const max = Math.max(...validData.map(Math.abs));

  // If max is 0, all values are 0, so set a small bar height
  const normalizedMax = max === 0 ? 1 : max;

  return (
    <svg width={width} height={height}>
      {validData.map((value, index) => {
        const barHeight = (Math.abs(value) / normalizedMax) * (height / 2);
        const x = index * barWidth;
        const y = value >= 0 ? height / 2 - barHeight : height / 2;
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

      <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#666" />
    </svg>
  );
};

export default MiniBarChart;
