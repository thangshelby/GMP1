//I should make this to be a server component to fetch data from server

"use client";

import * as d3 from "d3";
import React, { useEffect, useRef, Suspense } from "react";
import { ReviewStockType } from "@/types";
import { fetchAPI } from "@/lib/utils";
import { format, subMonths } from "date-fns";
const Treemap = () => {
  const endDate = format(subMonths(new Date(), 1), "yyyy-MM-dd");
  const [data, setData] = React.useState<ReviewStockType[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAPI(
        `stocks/stocks_review?quantity=${10}&end_date=${endDate}`,
      );
      setData(response);
    };
    fetchData();
  }, []);

  const ref = useRef<SVGSVGElement | null>(null);

  // useEffect(() => {
  //   if (!ref.current && !data.length) return;
  //   d3.select(ref.current).selectAll("*").remove();
  //   const nestedData = d3.group(data, (d: any) => d.industry);

  //   const hierarchyData = {
  //     name: "Tổng thị trường",
  //     //   value: d3.sum(data, (d: any) => d.market_cap),
  //     children: Array.from(nestedData, ([industry, stocks]) => ({
  //       name: industry,
  //       value: d3.sum(stocks, (d: any) => d.market_cap),
  //       change: d3.sum(stocks, (d: any) => d.change),
  //       children: stocks.map((stock) => ({
  //         name: stock.symbol,
  //         value: stock.market_cap,
  //         change: stock.change,
  //       })),
  //     })),
  //   };

  //   const width = 800;
  //   const height = 1000;
  //   const paddingInner = 6;
  //   const paddingOuter = 4;
  //   const paddingTop = 24;

  //   const max = d3.max(data, (d: any) => d.change);
  //   const min = d3.min(data, (d: any) => d.change);
  //   const colorScale = d3.scaleQuantize([-1, 1], colors);

  //   // **Bước 2: Xây dựng Treemap**
  //   const root = d3
  //     .treemap()
  //     .tile(d3.treemapBinary)
  //     .size([width, height])
  //     .paddingInner(paddingInner)
  //     .paddingOuter(paddingOuter)
  //     .paddingTop(paddingTop)
  //     .round(true)(
  //     d3
  //       .hierarchy(hierarchyData)
  //       .eachAfter((d) => {
  //         if (!d.children) {
  //           d.value = d.data.value; // Chỉ lấy market_cap của cổ phiếu
  //         }
  //       })
  //       .sum((d) => {
  //         if (d.name.length <= 5) {
  //           return d.value;
  //         }
  //       })
  //       .sort((a, b) => {
  //         // console.log(a,b)
  //         return b.value - a.value;
  //       }),
  //   );

  //   const svg = d3
  //     .select(ref.current)
  //     .attr("viewBox", [0, 0, width, height])
  //     .attr("width", width)
  //     .attr("height", height)
  //     .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  //   // **Bước 3: Vẽ nhóm cha (Industry - ngành)**
  //   const leafParent = svg
  //     .selectAll(".industry")
  //     .data(root.children || [])
  //     .join("g")
  //     .attr("class", "industry")
  //     .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

  //   // Vẽ viền bao quanh nhóm cha
  //   leafParent
  //     .append("rect")
  //     .attr("fill", (d: any) => {
  //       console.log(d.data.change, d.data.name);
  //       return colorScale(d.data.change);
  //     })
  //     .attr("stroke", "none")
  //     .attr("width", (d: any) => {
  //       if (d.data.value < 40000) return 0;
  //       // console.log(d.x1d.x2)
  //       if (d.x1 - d.x0 > 8) {
  //         return d.x1 - d.x0 - 8;
  //       }
  //       return d.x1 - d.x0;
  //     })
  //     .attr("height", (d: any) => 24)
  //     .attr(`transform", "translate(4,10)`);

  //   // Hiển thị tên ngành (Industry)
  //   leafParent
  //     .append("text")
  //     .attr("x", 5)
  //     .attr("y", 15)
  //     .attr("fill", "white")
  //     .style("font-size", "20px")
  //     .style("font-weight", "medium")
  //     .text((d: any) => {
  //       if (d.data.value > 40000) {
  //         return d.data.name.toUpperCase();
  //       }
  //     });

  //   // // **Bước 4: Vẽ từng mã chứng khoán (leaf)**
  //   const leaf = svg
  //     .selectAll(".leaf")
  //     .data(root.leaves())
  //     .join("g")
  //     .attr("class", "leaf")
  //     .attr("transform", (d: any) => `translate(${d.x0},${d.y0})`);

  //   leaf
  //     .append("rect")
  //     .attr("fill", (d: any) => colorScale(d.data.change))
  //     .attr("stroke", "white")
  //     .attr("width", (d: any) => d.x1 - d.x0)
  //     .attr("height", (d: any) => d.y1 - d.y0)
  //     .attr("transform", "translate(0, 0)");

  //   leaf
  //     .append("text")
  //     .filter((d) => d.x1 - d.x0 > 30 && d.y1 - d.y0 > 15) // Điều kiện ô đủ lớn
  //     .attr("x", (d: any) => (d.x1 - d.x0) / 2)
  //     .attr("y", (d: any) => (d.y1 - d.y0) / 2)
  //     .attr("text-anchor", "middle")
  //     .attr("fill", "white")
  //     .style("font-size", (d: any) => {
  //       const boxWidth = d.x1 - d.x0;
  //       const boxHeight = d.y1 - d.y0;
  //       return Math.max(8, Math.min(boxWidth / 10, boxHeight / 8)) + "px"; // Giới hạn kích thước chữ
  //     })
  //     .style("font-weight", "bold")
  //     .each(function (d: any) {
  //       const text = d3.select(this);
  //       const change =
  //         d.data.change > 0
  //           ? "+" + String(d.data.change.toFixed(2)) + "%"
  //           : "-" + d.data.change.toFixed(2) + "%";
  //       const lines = [d.data.name, d.data.change.toFixed(2)];

  //       lines.forEach((line, i) => {
  //         text
  //           .append("tspan")
  //           .attr("x", (d.x1 - d.x0) / 2)
  //           .attr("dy", i === 0 ? "0em" : "1.2em")
  //           .text(line);
  //       });
  //     });
  // }, [data]);

  return (
    // <Suspense fallback={<LoadingTable />}>
      <div className="h-full w-full rounded-sm border-[1px] border-gray-300 p-2 hover:cursor-pointer">
        <svg ref={ref}></svg>
      </div>
    // </Suspense>
  );
};

export default Treemap;

const colors = [
  "#f63538",
  "#bf4045",
  "#8b444e",
  "#414554",
  "#35764e",
  "#2f9e4f",
  "#30cc5a",
];

function LoadingTable() {
  return (
    <div className="flex h-[200px] items-center justify-center">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-transparent"></div>
    </div>
  );
}
