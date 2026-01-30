'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { initialAssignments, mockWriters, pendingWriters } from '@/modules/shared/data/assignments';

const AssignmentContext = createContext();

export function AssignmentProvider({ children }) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [writers] = useState(mockWriters);
  const [pendingWritersList, setPendingWritersList] = useState(pendingWriters);

  // Admin functions
  const assignWriter = (assignmentId, writerId, writerName) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          assignedWriter: writerId,
          writerName: writerName,
          status: 'ASSIGNED'
        };
      }
      return assignment;
    }));
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
  };

  const updateAssignmentStatus = (assignmentId, newStatus) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, status: newStatus };
      }
      return assignment;
    }));
  };

  const payWriter = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          paid: true,
          paidAt: new Date().toISOString().split('T')[0]
        };
      }
      return assignment;
    }));
  };

  const removeWriter = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          assignedWriter: null,
          writerName: null,
          status: 'PENDING'
        };
      }
      return assignment;
    }));
  };

  const approveWriter = (writerId) => {
    setPendingWritersList(prev => prev.filter(writer => writer.id !== writerId));
  };

  const rejectWriter = (writerId) => {
    setPendingWritersList(prev => prev.filter(writer => writer.id !== writerId));
  };

  // Writer functions
  const writerUploadAssignment = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, status: 'COMPLETED' };
      }
      return assignment;
    }));
  };

  const writerUpholdAssignment = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, status: 'IN_PROGRESS' };
      }
      return assignment;
    }));
  };

  // Get filtered assignments for different views
  const getAdminAssignments = () => assignments;
  const getWriterAssignments = () => assignments.filter(assignment => 
    assignment.assignedWriter && assignment.status !== 'PENDING'
  );
  const getPendingAssignments = () => assignments.filter(assignment => 
    assignment.status === 'PENDING'
  );
  const getCompletedAssignments = () => assignments.filter(assignment => 
    assignment.status === 'COMPLETED'
  );
  const getPaidAssignments = () => assignments.filter(assignment => 
    assignment.status === 'COMPLETED' && assignment.paid
  );
  const getUnpaidCompletedAssignments = () => assignments.filter(assignment => 
    assignment.status === 'COMPLETED' && !assignment.paid
  );

  const value = {
    assignments,
    writers,
    pendingWriters: pendingWritersList,
    assignWriter,
    deleteAssignment,
    updateAssignmentStatus,
    payWriter,
    removeWriter,
    approveWriter,
    rejectWriter,
    writerUploadAssignment,
    writerUpholdAssignment,
    getAdminAssignments,
    getWriterAssignments,
    getPendingAssignments,
    getCompletedAssignments,
    getPaidAssignments,
    getUnpaidCompletedAssignments
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
}
