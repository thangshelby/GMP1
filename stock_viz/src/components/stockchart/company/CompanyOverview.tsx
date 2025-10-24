import React from "react";
import { CompanyOverviewType } from "@/types";

const CompanyOverview = ({
  companyOverview,
}: {
  companyOverview: CompanyOverviewType | undefined;
}) => {
  return (
    <div className="h-full w-full rounded-sm border border-white p-1">
      <span className="text-secondary text-xs">
        - {companyOverview?.company_profile}
      </span>
    </div>
  );
};

export default CompanyOverview;
