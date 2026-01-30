'use client';

import { useState, useMemo } from 'react';
import Button from './Button';
import Badge from './Badge';

export default function DataTable({ 
  data, 
  columns, 
  searchable = true, 
  sortable = true, 
  filterable = true,
  pagination = true,
  pageSize = 10,
  className = ''
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Apply search
    if (searchQuery && searchable) {
      filtered = filtered.filter(item =>
        columns.some(column =>
          String(item[column.key] || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply filters
    if (filterable) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filtered = filtered.filter(item => item[key] === value);
        }
      });
    }

    // Apply sorting
    if (sortConfig.key && sortable) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, filters, sortConfig, searchable, filterable, sortable, columns]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = pagination 
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData;

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getUniqueValues = (key) => {
    return [...new Set(data.map(item => item[key]))];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="mb-4 p-4 bg-white border border-black rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            {searchable && (
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-black rounded-lg bg-white text-black"
                />
              </div>
            )}

            {/* Filters */}
            {filterable && columns.map(column => (
              column.filterable && (
                <div key={column.key} className="min-w-[150px]">
                  <select
                    value={filters[column.key] || ''}
                    onChange={(e) => handleFilter(column.key, e.target.value)}
                    className="w-full px-4 py-2 border border-black rounded-lg bg-white text-black"
                  >
                    <option value="">All {column.label}</option>
                    {getUniqueValues(column.key).map(value => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-black rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b border-black">
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-sm font-semibold text-black ${
                    sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => sortable && column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortable && column.sortable && (
                      <span className="text-xs">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="border-b border-black hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column.key} className="px-4 py-3 text-sm text-black">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white border border-black rounded-lg">
          <div className="text-sm text-black">
            Showing {((currentPage - 1) * pageSize) + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of{' '}
            {processedData.length} results
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              variant="secondary"
              size="sm"
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm text-black">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              variant="secondary"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
