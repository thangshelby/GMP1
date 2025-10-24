import { Skeleton } from "@/components/ui/skeleton";

const FinancialReportSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-y-2 bg-[#22262f]">
      {/* Header with categories and filters */}
      <div className="flex w-full flex-row items-center justify-between">
        {/* Categories skeleton */}
        <div className="flex flex-row items-center justify-start space-x-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20 bg-gray-600" />
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="flex flex-row items-center space-x-4">
          <div className="flex flex-row items-center justify-start">
            <Skeleton className="mr-2 h-4 w-8 bg-gray-600" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="ml-1 h-6 w-16 rounded-sm bg-gray-600"
              />
            ))}
          </div>
          <div className="flex flex-row items-center justify-start">
            <Skeleton className="mr-2 h-4 w-16 bg-gray-600" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className="ml-1 h-6 w-16 rounded-sm bg-gray-600"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-4 w-20 bg-gray-600" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-600/50">
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <Skeleton
                        className={`h-4 bg-gray-600 ${
                          colIndex === 0 ? "w-32" : "w-16"
                        }`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReportSkeleton;
