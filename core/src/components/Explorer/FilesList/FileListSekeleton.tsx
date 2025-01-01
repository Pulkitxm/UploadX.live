import { Skeleton } from "@/components/ui/skeleton";

export function FileListSkeleton() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-5xl flex-grow space-y-4">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-40" />
        </div>

        <div className="rounded-lg border bg-card p-1 shadow-sm">
          <table className="w-full">
            <thead className="hidden sm:table-header-group">
              <tr className="border-b">
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="hidden px-4 py-3 text-left sm:table-cell">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="hidden px-4 py-3 text-left md:table-cell">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="px-4 py-3 text-right">
                  <Skeleton className="ml-auto h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-10 w-10 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full max-w-[200px]" />
                        <div className="flex gap-1">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="hidden px-4 py-4 md:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
