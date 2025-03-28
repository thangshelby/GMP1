import * as d3 from "d3";
import { StockPriceDataType } from "@/types"

import { width, height } from "@/constants";

export const addMouseEvents = (
  y: any,
  data: StockPriceDataType[],
  setStockPrices: (stockPrice: StockPriceDataType) => void,
  xRanges: {
    [key: string]: { xStart: number | undefined; xEnd: number | undefined };
  },
) => {
  const svg = d3.select(".chart");
  const chartArea = svg.select(".chart-area");
  svg.on("mousemove", null);

  const verticalLine = chartArea.select(".vertical_line");
  const rectLabelY = chartArea.select(".vertical_rect");
  const textLabelY = chartArea.select(".vertical_label");
  const horizontalLine = chartArea.select(".horizontal_line");
  const rectLabelX = chartArea.select(".horizontal_rect");
  const textLabelX = chartArea.select(".horizontal_label");

  svg.on("mousemove", (event: any) => {
    const [xCor, yCor] = d3.pointer(event); // Lấy tọa độ chuột trong SVG

    if (xCor >= 10 && xCor <= width - 80 && yCor >= 10 && yCor <= height - 50) {
      const foundDate = Object.keys(xRanges).find((date) => {
        const { xStart, xEnd } = xRanges[date];
        return xStart! <= xCor && xCor <= xEnd!;
      });

      const date = foundDate || data[0].date;

      const currentPrice = y.invert(yCor);

      const stockPrice =
        data.find((d: StockPriceDataType) => d.date === date) || data[0];
      setStockPrices(stockPrice);

      verticalLine.attr("x1", xCor).attr("x2", xCor).style("opacity", 1);
      textLabelY
        .attr("x", width - 70) // Offset text slightly from the line
        .attr("y", yCor + 4) // Position text near the line
        .style("opacity", 1)
        .text(`${currentPrice.toFixed(0)}`);
      rectLabelY
        .attr("x", width - 70 - 5) // Offset text slightly from the line
        .attr("y", yCor - 7) // Position text near the line
        .style("opacity", 1);

      horizontalLine.attr("y1", yCor).attr("y2", yCor).style("opacity", 1);

      textLabelX
        .attr("x", xCor - 20) // Offset text slightly from the line
        .attr("y", height - 39) // Position text near the line
        .style("opacity", 1)
        .text(`${date}`);
      rectLabelX
        .attr("x", xCor - 30) // Offset text slightly from the line
        .attr("y", height - 50) // Position text near the line
        .style("opacity", 1);
    } else {
      verticalLine.style("opacity", 0); // Ẩn
      horizontalLine.style("opacity", 0); // Ẩn

      textLabelX.style("opacity", 0); // Ẩn
      textLabelY.style("opacity", 0); // Ẩn

      rectLabelX.style("opacity", 0); // Ẩn
      rectLabelY.style("opacity", 0); // Ẩn
    }
  });
};

export const addZoomBehavior = (
  y: any,
  data: StockPriceDataType[],
  candleWidth: number,
  x: any,
  setStockPrices: (stockPrice: StockPriceDataType) => void,
  xOrigin: number,
) => {
  const svg = d3.select(".chart");
  const chartArea = svg.select(".chart-area");
  svg.on("zoom", null);

  const zoomLevels = [0.5, 1, 2, 3, 5];
  const zoom = d3
    .zoom()
    .scaleExtent([zoomLevels[0], zoomLevels[zoomLevels.length - 1]]) // Min and max zoom levels
    .on("zoom", (event) => {
      const { transform } = event;

      const newXRange = [-10, width - 80].map((d) => d * transform.k);
      x.range(newXRange);
      const xRanges = data.reduce(
        (
          acc: {
            [key: string]: {
              xStart: number | undefined;
              xEnd: number | undefined;
            };
          },
          d,
        ) => {
          const xStart = x(d.date);
          const xEnd = xStart! + x.bandwidth();
          acc[d.date] = { xStart, xEnd }; // Lưu phạm vi xStart và xEnd cho mỗi giá trị
          return acc;
        },
        {},
      );

      svg.on("mousemove", null);
      addMouseEvents(y, data, setStockPrices, xRanges);

      const oldXAix = chartArea.select(".x-axis");
      oldXAix.remove();
      const xAxis = d3
        .axisBottom(x)
        .tickFormat((d: any) => `${new Date(d.valueOf()).getDate()}`) // Gắn thêm tiền tố "Label"
        .tickSize(10); // Tăng chiều dài ticks
      // .tickValues(["A", "C", "E"]);

      const xAxisGroup = chartArea
        .append("g")
        .call(xAxis)
        .attr("class", "x-axis");
      xAxisGroup
        .selectAll("text")
        .attr("class", "x-axis-text")
        .attr("transform", "translate(0,100)"); // Rotate x-axis text;

      xAxisGroup.selectAll("path, line").remove();
      xAxisGroup
        .selectAll("text")
        .style("fill", "#616a7a") // X-axis text color
        .style("font-size", "8px")
        .attr("class", `x-axis-text`)
        .style("font-weight", "bold")
        .style("transform", `translateY(${height - 40}px)`);

      chartArea
        .selectAll(".candle")
        .data(data)
        .attr("x", (d: StockPriceDataType) => {
          return x(d.date);
        })
        .attr("width", candleWidth); // Adjust width if needed

      // // Update volume bars
      chartArea
        .selectAll(".barVolume")
        .data(data)
        .attr("x", (d: StockPriceDataType) => {
          return x(d.date);
        })
        .attr("width", candleWidth); // Adjust width if needed

      // // Update wicks
      chartArea
        .selectAll(".wick")
        .data(data)
        .attr("x1", (d: StockPriceDataType) => x(d.date) + candleWidth / 2)
        .attr("x2", (d: StockPriceDataType) => x(d.date) + candleWidth / 2);
    });

  // Attach zoom behavior to SVG
  (
    svg as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>
  ).call(
    zoom as unknown as (
      selection: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    ) => void,
  );
};

export const addDragBehavior = (
  x: any,
  y: any,
  data: StockPriceDataType[],
  xOrigin: number,
  setXOrigin: (value: number) => void,
  setStockPrices: (stockPrice: StockPriceDataType) => void,
) => {
  let initialDragX = 0;
  let gapXX = 0;
  const chartArea = d3.select(".chart-area");
  const svg = d3.select(".chart");
  svg.on("drag", null);
  d3.select<SVGRectElement, unknown>(".chart-area").call(
    d3
      .drag<SVGRectElement, unknown>()
      .on("start", (event: any) => {
        initialDragX = event.x;
      })
      .on("drag", (event) => {
        const gapX = event.x - initialDragX + xOrigin;
        gapXX = gapX;

        d3.selectAll(".candle").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".wick").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".barVolume").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".line-chart").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".bar_line_close").attr(
          "transform",
          `translate(${gapX},0)`,
        );
        d3.selectAll(".bar_line_open").attr(
          "transform",
          `translate(${gapX},0)`,
        );

        d3.selectAll(".sma-line").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".bband-area").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".bb_lower-line").attr(
          "transform",
          `translate(${gapX},0)`,
        );
        d3.selectAll(".bb_middle-line").attr(
          "transform",
          `translate(${gapX},0)`,
        );
        d3.selectAll(".bb_upper-line").attr(
          "transform",
          `translate(${gapX},0)`,
        );

        // const rsi = d3
        //   .selectAll(".RSI-chart-area")
        // .attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".rsi-line").attr("transform", `translate(${gapX},0)`);

        // const mfi = d3
        //   .selectAll(".MFI-chart-area")
        // .attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".mfi-line").attr("transform", `translate(${gapX},0)`);
        // const macd = d3
        //   .selectAll(".MACD-chart-area")
        // .attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".macd-line").attr("transform", `translate(${gapX},0)`);
        d3.selectAll(".macd-signal-line").attr(
          "transform",
          `translate(${gapX},0)`,
        );
        d3.selectAll(".macd-hist-bar").attr(
          "transform",
          `translate(${gapX},0)`,
        );

        //RESCALE X
        const newXRange = [-(data.length - 112) * 10, width - 80].map(
          (d) => d + gapX,
        );

        x.range(newXRange);

        const xRanges = data.reduce(
          (
            acc: {
              [key: string]: {
                xStart: number | undefined;
                xEnd: number | undefined;
              };
            },
            d,
          ) => {
            const xStart = x(d.date);
            const xEnd = xStart! + x.bandwidth();
            acc[d.date] = { xStart, xEnd }; // Lưu phạm vi xStart và xEnd cho mỗi giá trị
            return acc;
          },
          {},
        );

        svg.on("mousemove", null);
        addMouseEvents(y, data, setStockPrices, xRanges);

        const oldXAix = chartArea.select(".x-axis");
        oldXAix.remove();

        const xDomain = d3.extent(data, (d) => new Date(d.date)) as [
          Date,
          Date,
        ];
        xDomain[1] = d3.timeDay.offset(xDomain[1], -1); // Shift the end date back by 1 day

        const newX = d3
          .scaleTime()
          .domain(xDomain)
          .range([-(data.length - 112) * 10, width - 80]);

        const xAxis = d3
          .axisBottom(newX)
          .ticks(d3.timeMonth.every(1)) // Tick mỗi tháng
          .tickFormat((domainValue: Date | d3.NumberValue) =>
            d3.timeFormat("%b %Y")(
              domainValue instanceof Date
                ? domainValue
                : new Date(domainValue.valueOf()),
            ),
          );

        // const totalXTranslate = Number(!rsi.empty())*150+ Number(!mfi.empty())*150 + Number(!macd.empty())*200;
        // console.log(totalXTranslate);
        const xAxisGroup = chartArea
          .append("g")
          .call(xAxis)
          .attr("class", "x-axis")
          .attr("transform", `translate(${gapX},${0})`);
        xAxisGroup
          .selectAll("text")
          .attr("class", "x-axis-text")
          .attr("transform", "translate(0,100)"); // Rotate x-axis text;

        xAxisGroup.selectAll("path, line").remove();
        xAxisGroup
          .selectAll("text")
          .style("fill", "#616a7a") // X-axis text color
          .style("font-size", "8px")
          .attr("class", `x-axis-text`)
          .style("font-weight", "bold")
          .style("transform", `translateY(${height - 40}px)`);
      })
      .on("end", function () {
        setXOrigin(gapXX);
        d3.select(this).classed("dragging", false);
      }),
  );
};
