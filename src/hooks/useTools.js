/**
 * useTools, useTool, useToolStats Hooks
 * Tools/practices data fetching with React Query caching.
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toolService } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

function invalidateToolCaches(queryClient) {
  queryClient.invalidateQueries({ queryKey: ['tools'] });
  queryClient.invalidateQueries({ queryKey: ['tool'] });
  queryClient.invalidateQueries({ queryKey: ['toolStats'] });
  queryClient.invalidateQueries({ queryKey: ['streak'] });
}

export function useTools(userId, options = {}) {
  const { autoFetch = true, withProgress = true } = options;
  const queryClient = useQueryClient();

  const { data: tools, isLoading: loading, error, refetch } = useQuery({
    queryKey: queryKeys.tools(userId),
    queryFn: async () => {
      let result;
      if (withProgress && userId) {
        result = await toolService.getToolsWithProgress(userId);
      } else {
        result = await toolService.getAll();
      }
      if (result.error) throw new Error(result.error);
      return result.data || [];
    },
    enabled: autoFetch,
    placeholderData: [],
  });

  const completeMutation = useMutation({
    mutationFn: (toolId) => toolService.markCompleted(userId, toolId),
    onSuccess: () => invalidateToolCaches(queryClient),
  });

  const markCompleted = useCallback(async (toolId) => {
    if (!userId) return { error: 'Not authenticated' };
    try {
      const result = await completeMutation.mutateAsync(toolId);
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }, [userId, completeMutation]);

  return {
    tools: tools ?? [],
    loading,
    error: error?.message ?? null,
    fetch: refetch,
    refresh: refetch,
    markCompleted,
  };
}

/**
 * Hook for a single tool
 */
export function useTool(toolId, userId) {
  const queryClient = useQueryClient();

  const { data, isLoading: loading, error, refetch } = useQuery({
    queryKey: queryKeys.tool(toolId, userId),
    queryFn: async () => {
      const { data: toolData, error: toolError } = await toolService.getById(toolId);
      if (toolError) throw new Error(toolError);

      let progressData = null;
      if (userId) {
        const { data: prog } = await toolService.getToolProgress(userId, toolId);
        progressData = prog;
      }
      return { tool: toolData, progress: progressData };
    },
    enabled: !!toolId,
  });

  const completeMutation = useMutation({
    mutationFn: () => toolService.markCompleted(userId, toolId),
    onSuccess: () => invalidateToolCaches(queryClient),
  });

  const markCompleted = useCallback(async () => {
    if (!userId || !toolId) return { error: 'Not authenticated' };
    try {
      const result = await completeMutation.mutateAsync();
      return result;
    } catch (err) {
      return { error: err.message };
    }
  }, [userId, toolId, completeMutation]);

  return {
    tool: data?.tool ?? null,
    progress: data?.progress ?? null,
    loading,
    error: error?.message ?? null,
    refresh: refetch,
    markCompleted,
  };
}

/**
 * Hook for tool completion statistics
 */
export function useToolStats(userId) {
  const { data: stats, isLoading: loading, error, refetch } = useQuery({
    queryKey: queryKeys.toolStats(userId),
    queryFn: async () => {
      const result = await toolService.getCompletionStats(userId);
      if (result.error) throw new Error(result.error);
      return result.stats;
    },
    enabled: !!userId,
  });

  return { stats: stats ?? null, loading, error: error?.message ?? null, refresh: refetch };
}

export default useTools;
