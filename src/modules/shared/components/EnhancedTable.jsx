'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import Badge from './Badge';

export default function EnhancedTable({ 
  data, 
  columns, 
  className = '',
  showHeader = true,
  striped = true,
  hover = true,
  compact = false,
  itemsPerPage = 6,
  enableSelection = false,
  onSelectAll,
  allSelected = false
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`w-full border-2 border-black rounded-lg overflow-hidden ${className}`}>
      <table className="w-full border-collapse table-fixed">
        {showHeader && (
          <thead>
            <tr className="border-b-2 border-black">
              {columns.map((column, index) => (
                <th
                  key={column.key || index}
                  className={`
                    text-xs font-bold text-black uppercase tracking-wider
                    border-r-2 border-black last:border-r-0
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${column.sortable !== false ? 'cursor-pointer' : ''}
                    ${column.width || ''}
                  `}
                  style={{ paddingTop: '8px', paddingBottom: '8px', paddingLeft: '20px', paddingRight: '20px' }}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className={`flex items-center gap-2 ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : ''}`}>
                    {column.label}
                    {column.sortable !== false && (
                      <span className="text-xs font-normal">{getSortIcon(column.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}
        
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={row.id || index}
              className={`
                ${striped && index % 2 === 1 ? 'bg-white' : 'bg-white'}
                ${hover ? '' : ''}
                border-b-2 border-black transition-colors
              `}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={column.key || colIndex}
                  className={`
                    text-sm text-black border-r-2 border-black last:border-r-0
                    ${column.align === 'center' ? 'text-center' : ''}
                    ${column.align === 'right' ? 'text-right' : ''}
                    ${compact ? '' : ''}
                    ${column.width || ''}
                  `}
                  style={{ paddingTop: '8px', paddingBottom: '8px', paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <div className="min-h-[2rem] flex items-center">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t-2 border-black bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} entries
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      currentPage === page
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Admin-specific table configuration
export const getAdminTableColumns = (enableSelection = false, onSelectAll, allSelected = false) => [
  ...(enableSelection ? [{
    key: 'select',
    label: (
      <input
        type="checkbox"
        checked={allSelected}
        onChange={onSelectAll}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
    ),
    align: 'center',
    sortable: false,
    width: 'w-12',
    render: (value, row) => (
      <input
        type="checkbox"
        checked={row.isSelected || false}
        onChange={() => row.onSelect && row.onSelect(row.id)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
    )
  }] : []),
  {
    key: 'id',
    label: 'ID',
    align: 'center',
    sortable: true,
    width: 'w-20',
    render: (value) => <span className="font-mono text-xs">{value}</span>
  },
  {
    key: 'clientName',
    label: 'Client',
    align: 'left',
    sortable: true,
    width: 'w-1/6',
    render: (value) => <span className="font-medium">{value}</span>
  },
  {
    key: 'title',
    label: 'Title',
    align: 'left',
    sortable: true,
    width: 'w-2/6',
    render: (value) => (
      <div className="max-w-xs" title={value}>
        <div className="font-medium truncate">
          {value.split(' ').slice(0, 3).join(' ')}{value.split(' ').length > 3 ? '...' : ''}
        </div>
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status',
    align: 'center',
    sortable: true,
    width: 'w-24',
    render: (value) => {
      const statusConfig = {
        'PENDING': { variant: 'warning', label: 'Pending' },
        'ASSIGNED': { variant: 'info', label: 'Assigned' },
        'IN_PROGRESS': { variant: 'info', label: 'In Progress' },
        'COMPLETED': { variant: 'success', label: 'Completed' },
        'READY': { variant: 'success', label: 'Ready' }
      };
      
      const config = statusConfig[value] || statusConfig.PENDING;
      return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
    }
  },
  {
    key: 'writerName',
    label: 'Writer',
    align: 'center',
    sortable: true,
    width: 'w-1/6',
    render: (value) => <span className="text-sm font-medium">{value || 'Unassigned'}</span>
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right',
    sortable: true,
    width: 'w-24',
    render: (value) => <span className="font-medium">${value}</span>
  },
  {
    key: 'deadline',
    label: 'Deadline',
    align: 'center',
    sortable: true,
    width: 'w-28',
    render: (value) => <span className="text-sm">{value}</span>
  },
  {
    key: 'actions',
    label: '',
    align: 'center',
    sortable: false,
    width: 'w-16',
    render: (value, row) => <AssignmentActions assignment={row} onAssignWriter={row.onAssignWriter} onDelete={row.onDelete} writers={row.writers} />
  }
];

// Assignment Actions Component
function AssignmentActions({ assignment, onAssignWriter, onDelete, writers }) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWriter, setSelectedWriter] = useState('');

  const handleAssignWriter = () => {
    if (selectedWriter && writers) {
      const writer = writers.find(w => w.id === selectedWriter);
      onAssignWriter(assignment.id, selectedWriter, writer?.name || 'Unknown Writer');
      setShowEditModal(false);
      setSelectedWriter('');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete assignment ${assignment.id}?`)) {
      onDelete(assignment.id);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="inline-flex items-center justify-center w-8 h-8 p-0 text-black hover:bg-gray-100 rounded transition-colors"
            aria-label="Open menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="z-[60] min-w-[150px]" style={{ left: 'auto !important', right: '0 !important' }}>
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            Edit Writer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDetailsModal(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDelete} className="text-red-600 hover:bg-red-50">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Writer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border border-black rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-black mb-4">Edit Writer Assignment</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Assignment ID: {assignment.id}
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-2">
                Current Writer: {assignment.assignedWriter || 'Unassigned'}
              </label>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Select Writer:
              </label>
              <select
                value={selectedWriter}
                onChange={(e) => setSelectedWriter(e.target.value)}
                className="w-full px-3 py-2 border border-black rounded-lg bg-white text-black"
              >
                <option value="">Select a writer...</option>
                {writers && writers.map(writer => (
                  <option key={writer.id} value={writer.id}>
                    {writer.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedWriter('');
                }}
                className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignWriter}
                disabled={!selectedWriter}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Assign Writer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Card */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
          <div className="assignment-card w-96 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="card-header">
              <div className="flex items-start justify-between">
                <h3 className="card-title">Assignment Details</h3>
                <span className={`status-badge ${
                  assignment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  assignment.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' :
                  assignment.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {assignment.status}
                </span>
              </div>
              <div className="card-meta">
                <span>ID: {assignment.id}</span>
                <span>•</span>
                <span>{assignment.clientName}</span>
              </div>
            </div>

            <div className="card-body">
              <div className="detail-row">
                <span className="detail-label">Title</span>
                <span className="detail-value">{assignment.title}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Description</span>
                <span className="detail-value text-sm">{assignment.description}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Assigned Writer</span>
                <span className="detail-value">{assignment.writerName || 'Unassigned'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Amount</span>
                <span className="detail-value font-semibold text-blue-600">
                  ${assignment.amount}
                </span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Deadline</span>
                <span className="detail-value">{assignment.deadline}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Submitted Date</span>
                <span className="detail-value">{assignment.submittedAt}</span>
              </div>
            </div>

            <div className="card-actions">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Writer dashboard table configuration
export const writerTableColumns = [
  {
    key: 'id',
    label: 'ID',
    align: 'center',
    sortable: true,
    render: (value) => <span className="font-mono text-xs">{value}</span>
  },
  {
    key: 'title',
    label: 'Title',
    align: 'left',
    sortable: true,
    render: (value) => (
      <div className="max-w-xs">
        <div className="font-medium truncate">{value}</div>
      </div>
    )
  },
  {
    key: 'clientName',
    label: 'Client',
    align: 'left',
    sortable: true,
    render: (value) => <span className="text-sm">{value}</span>
  },
  {
    key: 'status',
    label: 'Status',
    align: 'center',
    sortable: true,
    render: (value) => {
      const statusConfig = {
        'ASSIGNED': { variant: 'info', label: 'Assigned' },
        'IN_PROGRESS': { variant: 'info', label: 'In Progress' },
        'COMPLETED': { variant: 'success', label: 'Completed' }
      };
      
      const config = statusConfig[value] || statusConfig.ASSIGNED;
      return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
    }
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right',
    sortable: true,
    render: (value) => <span className="font-medium">${value}</span>
  },
  {
    key: 'deadline',
    label: 'Deadline',
    align: 'center',
    sortable: true,
    render: (value) => <span className="text-sm">{value}</span>
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'center',
    sortable: false,
    render: (value, row) => {
      if (row.status === 'ASSIGNED') {
        return (
          <div className="flex justify-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              📥 Download
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              ✅ Uphold
            </button>
          </div>
        );
      }
      if (row.status === 'IN_PROGRESS') {
        return (
          <div className="flex justify-center">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              📤 Upload
            </button>
          </div>
        );
      }
      if (row.status === 'COMPLETED') {
        return (
          <div className="flex justify-center">
            <Badge variant="success" size="sm">✅ Completed</Badge>
          </div>
        );
      }
      return null;
    }
  }
];
