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
}: {
  selectedCategory: string;
  selectedFilter: {
    data: number;
    timeFrame: number;
  };
  data: any;
}) => {
  return (
    <div className="border-secondary overflow-hidden rounded-lg border-[1px]">
      <Table className="">
        <TableHeader className="h-[20] bg-[#14161d]">
          <TableRow>
            <TableHead className="text-white text-[11px] font-normal">
              Period
            </TableHead>

            <TableHead className="text-white text-[11px] font-normal w-[50px]">
              
            </TableHead>
            {years.map((year) => (
              <TableHead
                key={year}
                className="text-white text-[11px] font-normal"
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
                className={`border-secondary hover:bg-button border-x-1 ${balanceSheetSpecial.includes(key) && "bg-[#14161d]"}`}
                key={index}
              >
                <TableCell className="text-white text-[11px] font-normal">
                  {key}
                </TableCell>

                <TableCell>
                  <MiniBarChart data={data[key].slice(0, 8)} />
                </TableCell>
                {data[key].slice(0, 8).map((item: any, index: number) => (
                  <TableCell
                    key={index}
                    className={`text-white text-[11px] font-normal`}
                  >
                    {formatNumber(item / 1000000)}
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

const balanceSheetSpecial = [
  "LIABILITIES (Bn. VND)",
  "Other long-term assets (Bn. VND)",
  "TOTAL ASSETS (Bn. VND)",
//   "TOTAL RESOURCES (Bn. VND)",
];
const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"];
