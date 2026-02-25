/**
 * useTools Hook
 * Manages tools/practices data fetching and progress
 */

import { useState, useEffect, useCallback } from 'react';
import { toolService } from '@/services';

export function useTools(userId, options = {}) {
  const { autoFetch = true, withProgress = true } = options;

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    let result;
    if (withProgress && userId) {
      result = await toolService.getToolsWithProgress(userId);
    } else {
      result = await toolService.getAll();
    }

    if (result.error) {
      setError(result.error);
    } else {
      setTools(result.data || []);
    }

    setLoading(false);
  }, [userId, withProgress]);

  const markCompleted = useCallback(
    async (toolId) => {
      if (!userId) return { error: 'Not authenticated' };

      setError(null);
      const result = await toolService.markCompleted(userId, toolId);

      if (result.error) {
        setError(result.error);
      } else {
        // Update local state
        setTools((prev) =>
          prev.map((tool) =>
            tool.id === toolId
              ? {
                  ...tool,
                  progress: {
                    ...(tool.progress || {}),
                    completed: true,
                    completed_at: new Date().toISOString(),
                    times_completed: ((tool.progress?.times_completed || 0) + 1),
                  },
                }
              : tool
          )
        );
      }

      return result;
    },
    [userId]
  );

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return {
    tools,
    loading,
    error,
    fetch,
    refresh: fetch,
    markCompleted,
  };
}

/**
 * Hook for a single tool
 */
export function useTool(toolId, userId) {
  const [tool, setTool] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!toolId) return;

    setLoading(true);
    setError(null);

    // Fetch tool details
    const { data: toolData, error: toolError } = await toolService.getById(toolId);

    if (toolError) {
      setError(toolError);
      setLoading(false);
      return;
    }

    setTool(toolData);

    // Fetch progress if user is logged in
    if (userId) {
      const { data: progressData } = await toolService.getToolProgress(userId, toolId);
      setProgress(progressData);
    }

    setLoading(false);
  }, [toolId, userId]);

  const markCompleted = useCallback(async () => {
    if (!userId || !toolId) return { error: 'Not authenticated' };

    const result = await toolService.markCompleted(userId, toolId);

    if (!result.error) {
      setProgress((prev) => ({
        ...(prev || {}),
        completed: true,
        completed_at: new Date().toISOString(),
        times_completed: ((prev?.times_completed || 0) + 1),
      }));
    }

    return result;
  }, [userId, toolId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    tool,
    progress,
    loading,
    error,
    refresh: fetch,
    markCompleted,
  };
}

/**
 * Hook for tool statistics
 */
export function useToolStats(userId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    const { stats: data, error: fetchError } = await toolService.getCompletionStats(userId);

    if (fetchError) {
      setError(fetchError);
    } else {
      setStats(data);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { stats, loading, error, refresh: fetch };
}

export default useTools;
