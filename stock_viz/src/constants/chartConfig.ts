import { CrosshairMode } from "lightweight-charts";

export const mainChartContainerOptions = {
  height: 450,
  layout: {
    background: { color: "#22262f" }, // Background color
    textColor: "#757e92", // Text color
  },
  grid: {
    vertLines: {
      style: 2,
      color: "rgba(255, 255, 255, 0.1)",
    },
    horzLines: {
      color: "rgba(255, 255, 255, 0.1)",

      style: 2,
    },
  },
  crosshair: { mode: CrosshairMode.Normal }, // Kích hoạt crosshair
  handleScroll: true,
  handleScale: true,
};

export const candleStickChartOptions = {
  upColor: "#26a69a",
  downColor: "#ef5350",
  borderVisible: false,
  wickUpColor: "#26a69a",
  wickDownColor: "#ef5350",
};

export const lineChartOptions = {
  lineWidth:2,
  color: "#2196F3",
};
export const areaChartOptions = {
  lineColor: "green",
  topColor: "rgba(34, 194, 34, 0.4)",
  bottomColor: "rgba(34, 194, 34, 0.1)",
};

export const barChartOptions = {
  upColor: "#26a69a",
  downColor: "#ef5350",
};

export const histogramChartOptions = {
  color: "#26a69a",
};
