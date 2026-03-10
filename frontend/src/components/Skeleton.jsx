// Base skeleton block
export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)

// Skeleton for a table row
export const TableRowSkeleton = ({ cols = 5 }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="py-2.5 sm:py-3 pr-3 sm:pr-4">
                <Skeleton className="h-3 sm:h-4 w-full" />
            </td>
        ))}
    </tr>
)

// Skeleton for a full table
export const TableSkeleton = ({ rows = 6, cols = 5 }) => (
    <tbody>
        {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
        ))}
    </tbody>
)

// Skeleton for a stat card
export const StatCardSkeleton = () => (
    <div className="card flex items-center gap-3 sm:gap-4">
        <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-1.5 sm:space-y-2">
            <Skeleton className="h-2.5 sm:h-3 w-20 sm:w-24" />
            <Skeleton className="h-6 sm:h-7 md:h-8 w-14 sm:w-16" />
        </div>
    </div>
)

// Skeleton for a course card
export const CourseCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
        <div className="flex gap-2.5 sm:gap-3">
            <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-1.5 sm:space-y-2">
                <Skeleton className="h-3.5 sm:h-4 w-3/4" />
                <Skeleton className="h-2.5 sm:h-3 w-full" />
                <Skeleton className="h-2.5 sm:h-3 w-1/2" />
            </div>
        </div>
    </div>
)

// Skeleton for profile page
export const ProfileSkeleton = () => (
    <div className="max-w-xs sm:max-w-lg md:max-w-2xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex-shrink-0" />
            <div className="space-y-1.5 sm:space-y-2">
                <Skeleton className="h-5 sm:h-6 w-32 sm:w-36 md:w-40" />
                <Skeleton className="h-3 sm:h-4 w-24 sm:w-28" />
            </div>
        </div>
        <div className="card space-y-3 sm:space-y-4">
            <Skeleton className="h-4 sm:h-5 w-36 sm:w-44 md:w-48" />
            <Skeleton className="h-9 sm:h-10 w-full" />
            <Skeleton className="h-9 sm:h-10 w-full" />
            <Skeleton className="h-9 sm:h-10 w-28 sm:w-32" />
        </div>
    </div>
)