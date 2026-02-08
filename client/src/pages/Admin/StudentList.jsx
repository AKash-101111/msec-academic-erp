import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import DataTable from '../../components/UI/DataTable';
import { useStudents, useBatches, useDepartments } from '../../services/queries';
import { useDebounce } from '../../hooks/useDebounce';

export default function StudentList() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

    // Debounce search input to reduce API calls
    const debouncedSearch = useDebounce(searchInput, 400);

    const filters = {
        search: debouncedSearch,
        batch: searchParams.get('batch') || '',
        department: searchParams.get('department') || '',
        page: parseInt(searchParams.get('page')) || 1
    };

    // Update URL when debounced search changes
    useEffect(() => {
        if (debouncedSearch !== searchParams.get('search')) {
            updateFilters('search', debouncedSearch);
        }
    }, [debouncedSearch]);

    // Use React Query hooks for data fetching with automatic caching
    const { data: studentsData, isLoading: studentsLoading } = useStudents({
        page: filters.page,
        limit: 20,
        search: filters.search || undefined,
        batch: filters.batch || undefined,
        department: filters.department || undefined
    });

    const { data: batchesData } = useBatches();
    const { data: departmentsData } = useDepartments();

    const students = studentsData?.data?.students || [];
    const pagination = studentsData?.data?.pagination || null;
    const batches = batchesData?.data?.batches || [];
    const departments = departmentsData?.data?.departments || [];

    const updateFilters = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        if (key !== 'page') {
            newParams.set('page', '1');
        }
        setSearchParams(newParams);
    };

    const clearFilters = () => {
        setSearchInput('');
        setSearchParams({});
    };

    const hasActiveFilters = debouncedSearch || filters.batch || filters.department;

    const columns = [
        { key: 'rollNumber', label: 'Roll No' },
        { key: 'name', label: 'Name' },
        { key: 'department', label: 'Dept' },
        { key: 'batch', label: 'Batch' },
        {
            key: 'gpa',
            label: 'GPA',
            render: (value) => value ? value.toFixed(2) : '-'
        },
        {
            key: 'attendancePercent',
            label: 'Attendance',
            render: (value) => {
                if (!value) return '-';
                let color = 'text-emerald-400';
                if (value < 60) color = 'text-red-400';
                else if (value < 75) color = 'text-amber-400';
                return <span className={color}>{value.toFixed(1)}%</span>;
            }
        },
        {
            key: 'riskStatus',
            label: 'Status',
            render: (value) => {
                const styles = {
                    'Normal': 'status-success',
                    'Attendance Risk': 'status-warning',
                    'Performance Risk': 'status-warning',
                    'High Risk': 'status-danger'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[value] || 'status-success'}`}>
                        {value}
                    </span>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Student Directory</h1>
                <p className="text-slate-400 mt-1">Browse and manage student records</p>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="flex-1 min-w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search by name or roll number..."
                                className="input-field pl-10"
                            />
                        </div>
                    </div>

                    {/* Batch filter */}
                    <select
                        value={filters.batch}
                        onChange={(e) => updateFilters('batch', e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="">All Batches</option>
                        {batches.map((batch) => (
                            <option key={batch} value={batch}>{batch}</option>
                        ))}
                    </select>

                    {/* Department filter */}
                    <select
                        value={filters.department}
                        onChange={(e) => updateFilters('department', e.target.value)}
                        className="input-field w-40"
                    >
                        <option value="">All Depts</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results info */}
            {pagination && (
                <p className="text-sm text-slate-400">
                    Found {pagination.total} students
                    {hasActiveFilters && ' matching your filters'}
                </p>
            )}

            {/* Data Table */}
            <DataTable
                columns={columns}
                data={students}
                loading={studentsLoading}
                pagination={pagination}
                onPageChange={(page) => updateFilters('page', page.toString())}
                onRowClick={(student) => navigate(`/admin/student/${student.id}`)}
                emptyMessage="No students found matching your criteria"
            />
        </div>
    );
}
