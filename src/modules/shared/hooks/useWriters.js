import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

export function useWriters() {
  const [writers, setWriters] = useState([]);
  const [pendingWriters, setPendingWriters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWriters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getWriters();
      setWriters(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingWriters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getPendingWriters();
      setPendingWriters(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const approveWriter = useCallback(async (writerId) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.approveWriter(writerId);
      setPendingWriters(prev => prev.filter(writer => writer.user_id !== writerId));
      setWriters(prev => prev.map(writer => 
        writer.user_id === writerId ? { ...writer, status: 'APPROVED' } : writer
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const rejectWriter = useCallback(async (writerId) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.rejectWriter(writerId);
      setPendingWriters(prev => prev.filter(writer => writer.user_id !== writerId));
      setWriters(prev => prev.map(writer => 
        writer.user_id === writerId ? { ...writer, status: 'REJECTED' } : writer
      ));
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    writers,
    pendingWriters,
    loading,
    error,
    fetchWriters,
    fetchPendingWriters,
    approveWriter,
    rejectWriter,
  };
}
