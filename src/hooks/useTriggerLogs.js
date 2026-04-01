/**
 * useTriggerLogs Hook — paginated trigger log data with CRUD
 * useTriggerStats Hook — aggregated trigger statistics
 *
 * Both use React Query for caching, deduplication, and background refetch.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { triggerLogService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useTriggerLogs(userId, options = {}) {
  const { autoFetch = true, page: initialPage = 1, limit = 20 } = options;
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [accumulatedLogs, setAccumulatedLogs] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const isAppending = useRef(false);
  const prevDataRef = useRef(null);

  const { data: queryData, isLoading, error: queryError, refetch } = useQuery({
    queryKey: queryKeys.triggerLogs(userId, { page: currentPage, limit }),
    queryFn: async () => {
      const result = await triggerLogService.getAll(userId, { page: currentPage, limit });
      if (result.error) throw new Error(result.error);
      return { data: result.data || [], pagination: result.pagination };
    },
    enabled: !!userId && autoFetch,
    placeholderData: (prev) => prev,
  });

  // Sync query data to accumulated logs
  useEffect(() => {
    if (!queryData || queryData === prevDataRef.current) return;
    prevDataRef.current = queryData;
    if (isAppending.current) {
      setAccumulatedLogs(prev => [...prev, ...queryData.data]);
      setLoadingMore(false);
      isAppending.current = false;
    } else {
      setAccumulatedLogs(queryData.data);
    }
  }, [queryData]);

  const pagination = queryData?.pagination ?? {
    page: 1, limit: 20, total: 0, totalPages: 0, hasMore: false,
  };

  const createMutation = useMutation({
    mutationFn: (data) => triggerLogService.create({ user_id: userId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triggerLogs'] });
      queryClient.invalidateQueries({ queryKey: ['triggerStats'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ logId, data }) => triggerLogService.update(logId, data),
    onSuccess: (result, { logId, data }) => {
      if (!result.error) {
        setAccumulatedLogs(prev =>
          prev.map(log => log.id === logId ? { ...log, ...data } : log)
        );
      }
      queryClient.invalidateQueries({ queryKey: ['triggerLogs'] });
      queryClient.invalidateQueries({ queryKey: ['triggerStats'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (logId) => triggerLogService.delete(logId),
    onSuccess: (result, logId) => {
      if (!result.error) {
        setAccumulatedLogs(prev => prev.filter(log => log.id !== logId));
      }
      queryClient.invalidateQueries({ queryKey: ['triggerLogs'] });
      queryClient.invalidateQueries({ queryKey: ['triggerStats'] });
    },
  });

  const create = useCallback(async (data) => {
    if (!userId) return { error: 'Not authenticated' };
    try {
      const result = await createMutation.mutateAsync(data);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }, [userId, createMutation]);

  const update = useCallback(async (logId, data) => {
    try {
      const result = await updateMutation.mutateAsync({ logId, data });
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }, [updateMutation]);

  const remove = useCallback(async (logId) => {
    try {
      const result = await removeMutation.mutateAsync(logId);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }, [removeMutation]);

  const goToPage = useCallback((newPage) => {
    isAppending.current = false;
    setCurrentPage(newPage);
  }, []);

  const loadMore = useCallback(() => {
    if (!pagination.hasMore || loadingMore) return;
    isAppending.current = true;
    setLoadingMore(true);
    setCurrentPage(prev => prev + 1);
  }, [pagination.hasMore, loadingMore]);

  const fetch = useCallback((fetchOptions = {}) => {
    if (fetchOptions.page) {
      isAppending.current = false;
      setCurrentPage(fetchOptions.page);
    }
    return refetch();
  }, [refetch]);

  return {
    logs: accumulatedLogs,
    pagination,
    loading: isLoading,
    loadingMore,
    error: queryError?.message ?? null,
    fetch,
    refresh: () => {
      isAppending.current = false;
      setCurrentPage(initialPage);
      setAccumulatedLogs([]);
      return refetch();
    },
    create,
    update,
    remove,
    goToPage,
    loadMore,
  };
}

/**
 * Hook for trigger log statistics — cached and deduplicated via React Query.
 * Multiple components requesting the same userId+days share a single fetch.
 */
export function useTriggerStats(userId, days = 30) {
  const { data: stats, isLoading: loading, error, refetch } = useQuery({
    queryKey: queryKeys.triggerStats(userId, days),
    queryFn: async () => {
      const result = await triggerLogService.getStats(userId, days);
      if (result.error) throw new Error(result.error);
      return result.stats;
    },
    enabled: !!userId,
  });

  return {
    stats: stats ?? null,
    loading,
    error: error?.message ?? null,
    refresh: refetch,
  };
}

export default useTriggerLogs;
