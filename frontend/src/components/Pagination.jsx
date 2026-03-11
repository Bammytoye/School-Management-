import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    // On mobile show limited page numbers to avoid overflow
    const getPages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (none, index) => index + 1)
        if (page <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (page >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', page - 1, page, page + 1, '...', totalPages]
    }

    return (
        <div className="flex items-center justify-center gap-1 sm:gap-2 mt-4 sm:mt-5 flex-wrap">

            {/* Prev */}
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
                <FiChevronLeft className="text-sm sm:text-base" />
                <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page numbers */}
            {getPages().map((page, index) =>
                page === '...' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="px-1.5 sm:px-2 py-1.5 text-xs sm:text-sm text-gray-400 dark:text-gray-500"
                    >
                        •••
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`min-w-[30px] sm:min-w-[34px] px-2.5 py-1.5 sm:px-3 text-xs sm:text-sm rounded-lg border transition-colors ${
                            page === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight className="text-sm sm:text-base" />
            </button>
        </div>
    )
}