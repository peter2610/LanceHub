import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export function useAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAssignments(params);
      setAssignments(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyAssignments = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getMyAssignments(params);
      setAssignments(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssignment = useCallback(async (assignmentData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.createAssignment(assignmentData);
      setAssignments(prev => [data, ...prev]);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const assignWriter = useCallback(async (assignmentId, writerId, writerName) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.assignWriter(assignmentId, writerId, writerName);
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, assignedWriter: writerId, writerName, status: 'ASSIGNED' }
          : assignment
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAssignmentStatus = useCallback(async (assignmentId, status, notes) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.updateAssignmentStatus(assignmentId, status, notes);
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status }
          : assignment
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAssignment = useCallback(async (assignmentId) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteAssignment(assignmentId);
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkAssignAssignments = useCallback(async (assignmentIds, writerId, writerName) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.bulkAssignAssignments(assignmentIds, writerId, writerName);
      setAssignments(prev => prev.map(assignment => 
        assignmentIds.includes(assignment.id)
          ? { ...assignment, assignedWriter: writerId, writerName, status: 'ASSIGNED' }
          : assignment
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteAssignments = useCallback(async (assignmentIds) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.bulkDeleteAssignments(assignmentIds);
      setAssignments(prev => prev.filter(assignment => !assignmentIds.includes(assignment.id)));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    fetchMyAssignments,
    createAssignment,
    assignWriter,
    updateAssignmentStatus,
    deleteAssignment,
    bulkAssignAssignments,
    bulkDeleteAssignments,
  };
}
