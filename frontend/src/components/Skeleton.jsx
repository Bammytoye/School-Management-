// Base skeleton block
export const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
)

// Skeleton for a table row
export const TableRowSkeleton = ({ cols = 5 }) => (
    <tr className="border-b border-gray-100 dark:border-gray-800">
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i} className="py-3 pr-4">
                <Skeleton className="h-4 w-full" />
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
    <div className="card flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
        </div>
    </div>
)

// Skeleton for a course card
export const CourseCardSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <div className="flex gap-3">
            <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    </div>
)

// Skeleton for profile page
export const ProfileSkeleton = () => (
    <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-28" />
            </div>
        </div>
        <div className="card space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
        </div>
    </div>
)