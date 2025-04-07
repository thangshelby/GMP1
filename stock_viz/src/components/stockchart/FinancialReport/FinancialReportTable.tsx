import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MiniBarChart from "./MiniBarChart";
import { formatNumber } from "@/constants";
const FinancialReportTable = ({
  selectedCategory,
  selectedFilter,
  data,
  specialProperties,
}: {
  selectedCategory: string;
  selectedFilter: {
    data: number[];
    timeFrame: number;
  };
  data: any;
  specialProperties: string[];
}) => {
  return (
    <div className="border-secondary overflow-hidden rounded-lg border-[1px]">
      <Table className="">
        <TableHeader className="h-[20] bg-[#14161d]">
          <TableRow>
            <TableHead className="text-[11px] font-normal text-white">
              Period
            </TableHead>

            <TableHead className="w-[50px] text-[11px] font-normal text-white"></TableHead>
            {years.map((year) => (
              <TableHead
                key={year}
                className="text-[11px] font-normal text-white"
              >
                FY {year}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Object.keys(data).map((key, index) => {
            return (
              <TableRow
                className={`border-secondary hover:bg-button border-x-1 ${specialProperties.includes(key) && "bg-[#14161d]"}`}
                key={index}
              >
                <TableCell className="flex flex-col text-[11px] font-normal text-white">
                  {key}
                  {selectedFilter.data.includes(0) && (
                    <p className="text-secondary">YoY Growth</p>
                  )}
                  {selectedFilter.data.includes(1) && (
                    <p className="text-secondary">YoY Growth %</p>
                  )}
                </TableCell>

                <TableCell>
                  <MiniBarChart data={data[key].slice(0, years.length)} />
                </TableCell>

                {data[key]
                  .slice(0, years.length)
                  .map((item: any, index: number) => (
                    <TableCell key={index}>
                      <div
                        className={`flex flex-col text-[11px] font-normal text-white`}
                      >
                        {formatNumber(item / 1000000)}
                        {selectedFilter.data.includes(0) && (
                          <span
                            className={`${item != years.length - 1 && (item - data[key][index + 1]) / 1000000 > 0 ? "text-green" : "text-red"}`}
                          >
                            {item != years.length - 1 &&
                              (item - data[key][index + 1]) / 1000000}
                          </span>
                        )}
                        {selectedFilter.data.includes(1) && (
                          <span
                            className={`${
                              item != years.length - 1 &&
                              ((item - data[key][index + 1]) /
                                data[key][index + 1]) *
                                100 >
                                0
                                ? "text-green"
                                : "text-red"
                            } `}
                          >
                            {item != years.length - 1 &&
                              (
                                ((item - data[key][index + 1]) /
                                  data[key][index + 1]) *
                                100
                              ).toFixed(2)}{" "}
                            %
                          </span>
                        )}
                      </div>
                    </TableCell>
                  ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FinancialReportTable;

const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018"];
