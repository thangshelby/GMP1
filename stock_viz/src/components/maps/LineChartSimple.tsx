"use client";
import React, { useEffect, useRef } from "react";

interface LineChartSimpleProps {
  data: number[];
  lineColor?: string;
  bgColor?: string;
  percentChange?: number;
  lineWidth?: number;

}

const LineChartSimple = ({ 
  data, 
  lineColor = "white",
  lineWidth = 1,
  bgColor,
  percentChange 

}: LineChartSimpleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background if provided
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Set line style
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    // Calculate scales
    const padding = 2;
    const minY = Math.min(...data);
    const maxY = Math.max(...data);
    const xScale = (canvas.width - padding * 2) / (data.length - 1);
    const yScale = (canvas.height - padding * 2) / (maxY - minY || 1); // Prevent division by zero

    // Draw line
    ctx.beginPath();
    data.forEach((point, i) => {
      const x = padding + i * xScale;
      const y = canvas.height - (padding + (point - minY) * yScale);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
  }, [data, lineColor, bgColor, lineWidth]);

  // Determine default background color based on percent change if not provided
  const defaultBgColor = percentChange 
    ? percentChange > 0 
      ? 'rgba(0, 128, 0, 0.8)' // Green for positive
      : 'rgba(178, 34, 34, 0.8)' // Red for negative
    : 'transparent';

  return (
    <canvas
      ref={canvasRef}
      width={lineWidth==1?60:70}
      height={lineWidth==1?20:25}
      style={{ 
        width: lineWidth==1?"60px":"70px", 
        height: lineWidth==1?"20px":"25px", 
        backgroundColor: bgColor || defaultBgColor,
        borderRadius: lineWidth==1?"2px":"4px"
      }}
    />
  );
};

export default LineChartSimple;
