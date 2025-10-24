import { Skeleton } from "@/components/ui/skeleton";

export default function StockChartSkeleton() {
  return (
    <div className="w-full bg-[#22262f] p-4 py-12">
      <div className="flex flex-col gap-8 px-20">
        <div className="flex flex-row gap-2">
          {/* Left side - 2/3 width */}
          <div className="flex w-2/3 flex-col items-end gap-2">
            {/* Company News Skeleton */}
            <div className="w-full rounded-lg border border-white/20 bg-[#2a2f3a] p-4">
              <div className="mb-4">
                <Skeleton className="h-6 w-32 bg-gray-600" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-4 w-3/4 bg-gray-600" />
                      <Skeleton className="h-3 w-1/2 bg-gray-600" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-gray-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Company Overview Skeleton */}
            <div className="w-full rounded-lg border border-white/20 bg-[#2a2f3a] p-4">
              <div className="mb-4">
                <Skeleton className="h-6 w-40 bg-gray-600" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3 bg-gray-600" />
                    <Skeleton className="h-4 w-1/4 bg-gray-600" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right side - 1/3 width */}
          <div className="flex w-1/3 flex-col items-start gap-2">
            {/* Company Subsidiary Skeleton */}
            <div className="w-full rounded-lg border border-white/20 bg-[#2a2f3a] p-4">
              <div className="mb-4">
                <Skeleton className="h-6 w-36 bg-gray-600" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-2/3 bg-gray-600" />
                    <Skeleton className="h-4 w-16 bg-gray-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Company Officer Skeleton */}
            <div className="w-full rounded-lg border border-white/20 bg-[#2a2f3a] p-4">
              <div className="mb-4">
                <Skeleton className="h-6 w-32 bg-gray-600" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="flex-1">
                      <Skeleton className="mb-1 h-4 w-3/4 bg-gray-600" />
                      <Skeleton className="h-3 w-1/2 bg-gray-600" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-12 bg-gray-600" />
                      <Skeleton className="h-4 w-8 bg-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Report Skeleton */}
        <div className="w-full rounded-lg border border-white/20 bg-[#2a2f3a] p-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 bg-gray-600" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-24 bg-gray-600" />
                <Skeleton className="h-32 w-full bg-gray-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
