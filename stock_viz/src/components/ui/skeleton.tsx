import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// Skeleton cho Stock Overview
export function StockOverviewSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between bg-[#181b22] px-8 py-4">
      {/* HEADER 1 - Skeleton */}
      <div className="flex flex-col">
        <div className="flex flex-row items-end gap-x-[0.8rem]">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="mt-2 flex flex-row items-center gap-x-[0.6rem]">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>

      {/* HEADER 2 - Skeleton */}
      <div className="flex flex-col items-end justify-between">
        <Skeleton className="mb-2 h-3 w-24" />
        <div className="flex flex-row items-center gap-x-[0.6rem]">
          <Skeleton className="h-10 w-24" />
          <div className="flex flex-col items-center justify-center">
            <Skeleton className="mb-1 h-3 w-8" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>

        <div className="mt-2 flex flex-row items-center gap-x-[0.6rem]">
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton key={index} className="h-3 w-16" />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Skeleton };
