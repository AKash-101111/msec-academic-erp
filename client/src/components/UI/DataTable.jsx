import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
    columns,
    data,
    loading,
    pagination,
    onPageChange,
    onRowClick,
    emptyMessage = 'No data found'
}) {
    if (loading) {
        return (
            <div className="glass-card overflow-hidden">
                <div className="animate-pulse">
                    <div className="h-12 bg-slate-800/50" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-t border-slate-700/50">
                            <div className="flex items-center h-full px-4 gap-4">
                                <div className="h-4 bg-slate-700 rounded w-1/4" />
                                <div className="h-4 bg-slate-700 rounded w-1/6" />
                                <div className="h-4 bg-slate-700 rounded w-1/5" />
                                <div className="h-4 bg-slate-700 rounded w-1/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="glass-card p-12 text-center">
                <p className="text-slate-400">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className={col.className}>
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={row.id || index}
                                onClick={() => onRowClick?.(row)}
                                className={onRowClick ? 'cursor-pointer' : ''}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={col.cellClassName}>
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} results
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onPageChange(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm text-white px-3">
                            {pagination.page} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= pagination.totalPages}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
