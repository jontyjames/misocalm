/**
 * useTriggerLogs Hook
 * Manages trigger log data fetching and operations
 */

import { useState, useEffect, useCallback } from 'react';
import { triggerLogService } from '@/services';

export function useTriggerLogs(userId, options = {}) {
  const { autoFetch = true, page = 1, limit = 20 } = options;

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [loading, setLoading] = useState(autoFetch);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(
    async (fetchOptions = {}) => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      const { data, pagination: pag, error: fetchError } = await triggerLogService.getAll(
        userId,
        {
          page: fetchOptions.page || page,
          limit: fetchOptions.limit || limit,
          ...fetchOptions,
        }
      );

      if (fetchError) {
        setError(fetchError);
      } else {
        setLogs(data || []);
        setPagination(pag);
      }

      setLoading(false);
    },
    [userId, page, limit]
  );

  const create = useCallback(
    async (data) => {
      if (!userId) return { error: 'Not authenticated' };

      setError(null);
      const result = await triggerLogService.create({
        user_id: userId,
        ...data,
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Refresh the list
        await fetch();
      }

      return result;
    },
    [userId, fetch]
  );

  const update = useCallback(
    async (logId, data) => {
      setError(null);
      const result = await triggerLogService.update(logId, data);

      if (result.error) {
        setError(result.error);
      } else {
        // Update local state
        setLogs((prev) =>
          prev.map((log) =>
            log.id === logId ? { ...log, ...data } : log
          )
        );
      }

      return result;
    },
    []
  );

  const remove = useCallback(
    async (logId) => {
      setError(null);
      const result = await triggerLogService.delete(logId);

      if (result.error) {
        setError(result.error);
      } else {
        // Remove from local state
        setLogs((prev) => prev.filter((log) => log.id !== logId));
      }

      return result;
    },
    []
  );

  const goToPage = useCallback(
    async (newPage) => {
      await fetch({ page: newPage });
    },
    [fetch]
  );

  /**
   * Load more entries (append to existing list)
   */
  const loadMore = useCallback(
    async () => {
      if (!userId || !pagination.hasMore || loadingMore) return;

      setLoadingMore(true);
      setError(null);

      const nextPage = pagination.page + 1;
      const { data, pagination: pag, error: fetchError } = await triggerLogService.getAll(
        userId,
        { page: nextPage, limit }
      );

      if (fetchError) {
        setError(fetchError);
      } else {
        setLogs((prev) => [...prev, ...(data || [])]);
        setPagination(pag);
      }

      setLoadingMore(false);
    },
    [userId, pagination.hasMore, pagination.page, limit, loadingMore]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && userId) {
      fetch();
    }
  }, [autoFetch, userId, fetch]);

  return {
    logs,
    pagination,
    loading,
    loadingMore,
    error,
    fetch,
    refresh: fetch,
    create,
    update,
    remove,
    goToPage,
    loadMore,
  };
}

/**
 * Hook for trigger log statistics
 */
export function useTriggerStats(userId, days = 30) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { stats: data, error: fetchError } = await triggerLogService.getStats(userId, days);

    if (fetchError) {
      setError(fetchError);
    } else {
      setStats(data);
    }

    setLoading(false);
  }, [userId, days]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refresh: fetch };
}

export default useTriggerLogs;
