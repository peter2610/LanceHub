'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/modules/shared/hooks/useAuth';
import { useAssignments } from '@/modules/shared/hooks/useAssignments';
import { useWriters } from '@/modules/shared/hooks/useWriters';
import EnhancedTable, { getAdminTableColumns } from '@/modules/shared/components/EnhancedTable';
import { MoreHorizontal } from "lucide-react";

const mockAssignments = [
  {
    id: 'LH-2025-001',
    clientId: '1',
    clientName: 'John Doe',
    title: 'Research Paper on Machine Learning',
    description: '10-page research paper on ML applications in healthcare',
    status: 'PENDING',
    amount: 150,
    deadline: '2025-02-01',
    assignedWriter: null,
    submittedAt: '2025-01-27'
  },
  {
    id: 'LH-2025-002',
    clientId: '2',
    clientName: 'Jane Smith',
    title: 'Business Plan for Startup',
    description: 'Comprehensive business plan for tech startup',
    status: 'ASSIGNED',
    amount: 200,
    deadline: '2025-02-05',
    assignedWriter: '2',
    writerName: 'Test Writer',
    submittedAt: '2025-01-26'
  },
  {
    id: 'LH-2025-003',
    clientId: '3',
    clientName: 'Bob Johnson',
    title: 'Marketing Strategy Analysis',
    description: 'Analysis of current marketing strategies and recommendations',
    status: 'COMPLETED',
    amount: 120,
    deadline: '2025-01-30',
    assignedWriter: '2',
    writerName: 'Test Writer',
    submittedAt: '2025-01-25'
  },
  {
    id: 'LH-2025-004',
    clientId: '4',
    clientName: 'Alice Wilson',
    title: 'Financial Report Analysis',
    description: 'Quarterly financial report with detailed analysis',
    status: 'IN_PROGRESS',
    amount: 180,
    deadline: '2025-02-10',
    assignedWriter: '4',
    writerName: 'Sarah Wilson',
    submittedAt: '2025-01-24'
  },
  {
    id: 'LH-2025-005',
    clientId: '5',
    clientName: 'Charlie Brown',
    title: 'Website Content Development',
    description: 'Complete website content for e-commerce platform',
    status: 'PENDING',
    amount: 250,
    deadline: '2025-02-15',
    assignedWriter: null,
    submittedAt: '2025-01-23'
  },
  {
    id: 'LH-2025-006',
    clientId: '6',
    clientName: 'Diana Prince',
    title: 'Legal Document Review',
    description: 'Review and edit legal contracts and agreements',
    status: 'ASSIGNED',
    amount: 300,
    deadline: '2025-02-08',
    assignedWriter: '5',
    writerName: 'Mike Chen',
    submittedAt: '2025-01-22'
  },
  {
    id: 'LH-2025-007',
    clientId: '7',
    clientName: 'Edward Norton',
    title: 'Technical Documentation',
    description: 'API documentation and user manuals',
    status: 'COMPLETED',
    amount: 160,
    deadline: '2025-01-28',
    assignedWriter: '4',
    writerName: 'Sarah Wilson',
    submittedAt: '2025-01-21',
    paid: true,
    paidAt: '2025-01-22'
  },
  {
    id: 'LH-2025-008',
    clientId: '8',
    clientName: 'Fiona Green',
    title: 'Social Media Strategy',
    description: 'Comprehensive social media marketing strategy',
    status: 'PENDING',
    amount: 140,
    deadline: '2025-02-12',
    assignedWriter: null,
    submittedAt: '2025-01-20'
  },
  {
    id: 'LH-2025-009',
    clientId: '9',
    clientName: 'George Miller',
    title: 'Product Description Writing',
    description: 'Engaging product descriptions for online store',
    status: 'ASSIGNED',
    amount: 110,
    deadline: '2025-02-06',
    assignedWriter: '2',
    writerName: 'Test Writer',
    submittedAt: '2025-01-19'
  },
  {
    id: 'LH-2025-010',
    clientId: '10',
    clientName: 'Helen Troy',
    title: 'Research Proposal',
    description: 'Academic research proposal for funding application',
    status: 'APPROVED',
    amount: 220,
    deadline: '2025-02-18',
    assignedWriter: '5',
    writerName: 'Mike Chen',
    submittedAt: '2025-01-18'
  }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { 
    assignments,
    loading: assignmentsLoading,
    fetchAssignments,
    assignWriter,
    deleteAssignment,
    bulkAssignAssignments,
    bulkDeleteAssignments
  } = useAssignments();
  
  const { 
    writers,
    pendingWriters,
    loading: writersLoading,
    fetchWriters,
    fetchPendingWriters,
    approveWriter,
    rejectWriter
  } = useWriters();
  
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('assignments');
  
  // Fetch data on component mount
  useEffect(() => {
    fetchAssignments();
    fetchWriters();
    fetchPendingWriters();
  }, [fetchAssignments, fetchWriters, fetchPendingWriters]);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAssignments, setSelectedAssignments] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Computed properties
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchTerm === '' || 
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.writer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const paidAssignments = assignments.filter(assignment => 
    assignment.status === 'COMPLETED' && assignment.paid
  );
  
  const unpaidCompletedAssignments = assignments.filter(assignment => 
    assignment.status === 'COMPLETED' && !assignment.paid && assignment.assigned_writer_id
  );
  

  const handleAssignWriter = (assignmentId, writerId, writerName) => {
    assignWriter(assignmentId, writerId, writerName);
  };

  const handleDeleteAssignment = (assignmentId) => {
    deleteAssignment(assignmentId);
  };

  // Bulk action handlers
  const handleSelectAssignment = (assignmentId) => {
    setSelectedAssignments(prev => 
      prev.includes(assignmentId) 
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssignments.length === filteredAssignments.length) {
      setSelectedAssignments([]);
    } else {
      setSelectedAssignments(filteredAssignments.map(a => a.id));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedAssignments.length} assignments?`)) {
      try {
        await bulkDeleteAssignments(selectedAssignments);
        setSelectedAssignments([]);
        setShowBulkActions(false);
      } catch (error) {
        console.error('Bulk delete error:', error);
      }
    }
  };

  // Export functionality
  const handleExportCSV = () => {
    const headers = ['ID', 'Client', 'Title', 'Status', 'Writer', 'Amount', 'Deadline'];
    const csvData = filteredAssignments.map(assignment => [
      assignment.id,
      assignment.clientName,
      assignment.title,
      assignment.status,
      assignment.writerName || 'Unassigned',
      assignment.amount,
      assignment.deadline
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assignments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Writer management functions
  const handleApproveWriter = (writerId) => {
    approveWriter(writerId);
  };

  const handleRejectWriter = (writerId) => {
    if (window.confirm('Are you sure you want to reject this writer?')) {
      rejectWriter(writerId);
    }
  };

  const handlePayWriter = async (assignmentId) => {
    try {
      await assignWriter(assignmentId, null, null); // This would be a separate payment endpoint
      // For now, just mark as paid
      await fetchAssignments(); // Refresh data
    } catch (error) {
      console.error('Pay writer error:', error);
    }
  };

  const handleRemoveWriter = async (assignmentId) => {
    try {
      await assignWriter(assignmentId, null, null);
    } catch (error) {
      console.error('Remove writer error:', error);
    }
  };


  const handleApproveAssignment = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, status: 'APPROVED' };
      }
      return assignment;
    }));
  };

  const handleRejectAssignment = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, status: 'REJECTED', assignedWriter: null, writerName: null };
      }
      return assignment;
    }));
  };

  const getStatusStyle = (status) => {
    return 'bg-white text-black border border-black';
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p>Welcome back, {user?.name}</p>
      </div>

      <div className="w-full mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'assignments'
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Assignments ({assignments.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Payments ({unpaidCompletedAssignments.length})
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'paid'
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Paid ({paidAssignments.length})
            </button>
            <button
              onClick={() => setActiveTab('writers')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'writers'
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Writers ({writers.length})
            </button>
            <button
              onClick={() => setActiveTab('pending-writers')}
              className={`py-4 px-6 border-b-2 font-medium text-sm ${
                activeTab === 'pending-writers'
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              Pending ({pendingWriters.length})
            </button>
          </nav>
        </div>

        {activeTab === 'assignments' && (
          <div className="p-6 w-full">
            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search Input */}
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Search assignments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                >
                  Export CSV
                </button>
                {selectedAssignments.length > 0 && (
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                  >
                    Bulk Actions ({selectedAssignments.length})
                  </button>
                )}
              </div>
            </div>

            {/* Bulk Actions Panel */}
            {showBulkActions && selectedAssignments.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Bulk Actions</h4>
                    <p className="text-sm text-blue-700">{selectedAssignments.length} assignments selected</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      onChange={(e) => {
                        const [writerId, writerName] = e.target.value.split('|');
                        if (writerId) handleBulkAssign(writerId, writerName);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Assign to writer...</option>
                      {writers.map(writer => (
                        <option key={writer.id} value={`${writer.id}|${writer.name}`}>
                          {writer.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleBulkDelete}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Delete Selected
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAssignments([]);
                        setShowBulkActions(false);
                      }}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="mb-4 text-sm">
              Showing {filteredAssignments.length} of {assignments.length} assignments
              {searchTerm && ` for "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            </div>

            {/* Table */}
            <div className="overflow-x-auto flex justify-center">
              <div className="w-full max-w-6xl">
                <EnhancedTable 
                  data={filteredAssignments.map(assignment => ({
                    ...assignment,
                    onAssignWriter: handleAssignWriter,
                    onDelete: handleDeleteAssignment,
                    onSelect: handleSelectAssignment,
                    isSelected: selectedAssignments.includes(assignment.id),
                    writers: writers
                  }))}
                  columns={getAdminTableColumns(true, handleSelectAll, selectedAssignments.length === filteredAssignments.length && filteredAssignments.length > 0)}
                  striped={true}
                  hover={true}
                  itemsPerPage={6}
                  enableSelection={true}
                  onSelectAll={handleSelectAll}
                  allSelected={selectedAssignments.length === filteredAssignments.length && filteredAssignments.length > 0}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Pending Writer Payments</h3>
            {unpaidCompletedAssignments.length === 0 ? (
              <div className="text-center py-8">
                <p>No pending payments</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {unpaidCompletedAssignments.map((assignment) => (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <p className="text-sm">{assignment.id}</p>
                        </div>
                        <span className="text-lg font-bold">${assignment.amount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">Writer</p>
                          <p className="font-medium">{assignment.writerName}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handlePayWriter(assignment.id, assignment.assignedWriter, assignment.amount)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Pay Writer
                          </button>
                          <button
                            onClick={() => handleRemoveWriter(assignment.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Remove Writer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'paid' && (
          <div className="p-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Paid Assignments</h3>
            {paidAssignments.length === 0 ? (
              <div className="text-center py-8">
                <p>No paid assignments yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paidAssignments.map((assignment) => (
                  <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{assignment.title}</h4>
                          <p className="text-sm">{assignment.id}</p>
                        </div>
                        <span className="text-lg font-bold">${assignment.amount}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">Writer</p>
                          <p className="font-medium">{assignment.writerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">Paid Date</p>
                          <p className="font-medium">{assignment.paidAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending-writers' && (
          <div className="p-6 w-full">
            <h3 className="text-lg font-semibold mb-4">Pending Writer Approvals</h3>
            {pendingWriters.length === 0 ? (
              <div className="text-center py-8">
                <p>No pending writer approvals</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingWriters.map((writer) => (
                  <div key={writer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{writer.name}</h4>
                          <p className="text-sm">{writer.email}</p>
                        </div>
                        <span className="text-lg font-bold">⭐ {writer.rating}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">Status</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                            Pending Approval
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveWriter(writer.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectWriter(writer.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'writers' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {writers.map((writer) => (
                <div key={writer.id} className="border border-black rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{writer.name}</h3>
                  <p className="mb-4">{writer.email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Active Assignments:</span>
                      <span className="font-medium">{writer.activeAssignments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span className="font-medium">⭐ {writer.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
