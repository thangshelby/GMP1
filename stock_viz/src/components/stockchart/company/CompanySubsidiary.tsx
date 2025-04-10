import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanySubsidiaryType } from "@/types";

const CompanySubsidiary = ({
  subsidiaries,
}: {
  subsidiaries: CompanySubsidiaryType[];
}) => {
  return (
    <div className="w-[40%] rounded-sm border-1 border-white p-1 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-secondary text-[11px] font-normal">
              Organization Name
            </TableHead>

            <TableHead className="text-secondary text-[11px] font-normal">
              Percent
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subsidiaries.slice(0,7).map((item, index) => (
            <TableRow key={index}>
              <TableCell className="text-primary truncate text-[11px] font-normal">
                {item.sub_company_name
                  .replace("Công ty", "CT")
                  .replace("Công Ty", "CT")}
              </TableCell>

              <TableCell className="text-green text-[11px] font-normal">
                {item.sub_own_percent}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanySubsidiary;
