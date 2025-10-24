"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { CompanyOfficerType } from "@/types";
const CompanyOfficer = ({
  companyOfficers,
}: {
  companyOfficers: CompanyOfficerType[];
}) => {
  const [workingType, setWorkingType] = useState("đang làm việc");
  const [filteredOfficers, setFilteredOfficers] = useState(companyOfficers);
  useEffect(() => {
    if (workingType === "all") {
      setFilteredOfficers(companyOfficers);
    } else {
      const filtered = companyOfficers.filter(
        (officer) => officer.type === workingType,
      );
      setFilteredOfficers(filtered);
    }
  }, [workingType, companyOfficers, setFilteredOfficers]);
  return (
    <div className="w-full flex-1 overflow-auto rounded-sm border border-white p-1">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-secondary text-[11px] font-normal">
              Officer Name
            </TableHead>
            <TableHead className="flex flex-row items-center gap-1">
              <span className="text-secondary text-[11px] font-normal">
                Officer Position
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-button border-primary rounded-sm border-[1px] px-2 py-[2px] text-white hover:cursor-pointer">
                  {workingType}{" "}
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={workingType}
                    onValueChange={setWorkingType}
                  >
                    <DropdownMenuRadioItem
                      className="hover:cursor-pointer"
                      value={"all"}
                    >
                      Tất cả
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      className="hover:cursor-pointer"
                      value={"đang làm việc"}
                    >
                      Còn làm việc
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      className="hover:cursor-pointer"
                      value={"đã từ nhiệm"}
                    >
                      Đã nghĩ
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>

            <TableHead className="text-secondary text-[11px] font-normal">
              Percent
            </TableHead>
            <TableHead className="text-secondary text-[11px] font-normal">
              Quantity
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOfficers.map((officer, index) => (
            <TableRow key={index}>
              <TableCell className="text-primary text-xs">
                {officer.officer_name}
              </TableCell>
              <TableCell className="text-primary text-xs">
                {officer.officer_position} ({officer.type})
              </TableCell>
              <TableCell className="text-green text-xs">
                {(officer.officer_own_percent * 100).toFixed(2)} %
              </TableCell>
              <TableCell className="text-secondary text-xs">
                {officer.quantity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyOfficer;
