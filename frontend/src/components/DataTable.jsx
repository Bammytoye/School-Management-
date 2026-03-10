import { useState } from 'react'

export default function DataTable({ columns, data, loading, emptyState }) {
    const [sortKey, setSortKey]   = useState(null)
    const [sortDir, setSortDir]   = useState('asc')

    const handleSort = (key) => {
        if (!key) return
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('asc') }
    }

    const sorted = sortKey
        ? [...data].sort((a, b) => {
            const av = a[sortKey] ?? ''
            const bv = b[sortKey] ?? ''
            const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true })
            return sortDir === 'asc' ? cmp : -cmp
        })
        : data

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable && handleSort(col.key)}
                                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none ${
                                    col.sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200' : ''
                                }`}
                            >
                                <span className="flex items-center gap-1">
                                    {col.label}
                                    {col.sortable && (
                                        <span className="text-gray-300 dark:text-gray-600">
                                            {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                                        </span>
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'}>
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : sorted.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="py-2">
                                {emptyState}
                            </td>
                        </tr>
                    ) : (
                        sorted.map((row, i) => (
                            <tr
                                key={row.id || i}
                                className={`border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-900/10 ${
                                    i % 2 === 0
                                        ? 'bg-white dark:bg-gray-900'
                                        : 'bg-gray-50/50 dark:bg-gray-800/30'
                                }`}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}