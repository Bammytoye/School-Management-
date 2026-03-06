export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
                ← Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${p === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
                Next →
            </button>
        </div>
    );
}