/**
 * Tool Service
 * Handles tools/practices and user progress
 */

import { db } from './supabase';

export const toolService = {
  /**
   * Get all available tools
   */
  async getAll(options = {}) {
    return db.selectPaginated('tools', {
      page: options.page || 1,
      limit: options.limit || 50,
      orderBy: options.orderBy || 'sort_order',
      ascending: options.ascending ?? true,
      filters: options.filters || {},
    });
  },

  /**
   * Get a single tool by ID
   */
  async getById(toolId) {
    const { data, error } = await db.select('tools', '*', { id: toolId });
    return { data: data?.[0] || null, error };
  },

  /**
   * Get tools by category
   */
  async getByCategory(category) {
    const { data, error } = await db.query((supabase) =>
      supabase
        .from('tools')
        .select('*')
        .eq('category', category)
        .order('sort_order', { ascending: true })
    );
    return { data, error };
  },

  /**
   * Get tools by level
   */
  async getByLevel(level) {
    const { data, error } = await db.query((supabase) =>
      supabase
        .from('tools')
        .select('*')
        .eq('level', level)
        .order('sort_order', { ascending: true })
    );
    return { data, error };
  },

  /**
   * Get user's progress for all tools
   */
  async getUserProgress(userId) {
    const { data, error } = await db.select('user_tool_progress', '*', {
      user_id: userId,
    });
    return { data, error };
  },

  /**
   * Get user's progress for a specific tool
   */
  async getToolProgress(userId, toolId) {
    const { data, error } = await db.select('user_tool_progress', '*', {
      user_id: userId,
      tool_id: toolId,
    });
    return { data: data?.[0] || null, error };
  },

  /**
   * Mark a tool as completed
   */
  async markCompleted(userId, toolId) {
    // Check if progress record exists
    const { data: existing } = await this.getToolProgress(userId, toolId);

    if (existing) {
      // Update existing record
      return db.update('user_tool_progress', existing.id, {
        completed: true,
        completed_at: new Date().toISOString(),
        times_completed: (existing.times_completed || 0) + 1,
      });
    } else {
      // Create new record
      return db.insert('user_tool_progress', {
        user_id: userId,
        tool_id: toolId,
        completed: true,
        completed_at: new Date().toISOString(),
        times_completed: 1,
      });
    }
  },

  /**
   * Toggle favorite status for a tool
   */
  async toggleFavorite(userId, toolId) {
    const { data: existing } = await this.getToolProgress(userId, toolId);

    if (existing) {
      return db.update('user_tool_progress', existing.id, {
        favorited: !existing.favorited,
      });
    } else {
      return db.insert('user_tool_progress', {
        user_id: userId,
        tool_id: toolId,
        favorited: true,
      });
    }
  },

  /**
   * Get user's favorite tools
   */
  async getFavorites(userId) {
    const { data: progress, error: progressError } = await db.query((supabase) =>
      supabase
        .from('user_tool_progress')
        .select('tool_id')
        .eq('user_id', userId)
        .eq('favorited', true)
    );

    if (progressError || !progress?.length) {
      return { data: [], error: progressError };
    }

    const toolIds = progress.map((p) => p.tool_id);
    const { data, error } = await db.query((supabase) =>
      supabase
        .from('tools')
        .select('*')
        .in('id', toolIds)
        .order('sort_order', { ascending: true })
    );

    return { data, error };
  },

  /**
   * Get tools with user progress merged
   */
  async getToolsWithProgress(userId, options = {}) {
    // Get all tools
    const { data: tools, error: toolsError } = await this.getAll(options);
    if (toolsError || !tools) {
      return { data: null, error: toolsError };
    }

    // Get user progress
    const { data: progress } = await this.getUserProgress(userId);
    const progressMap = new Map(
      (progress || []).map((p) => [p.tool_id, p])
    );

    // Merge progress into tools
    const toolsWithProgress = tools.map((tool) => ({
      ...tool,
      progress: progressMap.get(tool.id) || null,
    }));

    return { data: toolsWithProgress, error: null };
  },

  /**
   * Get completion stats for a user
   */
  async getCompletionStats(userId) {
    const { data: tools } = await this.getAll();
    const { data: progress } = await this.getUserProgress(userId);

    const totalTools = tools?.length || 0;
    const completedTools = (progress || []).filter((p) => p.completed).length;
    const favoriteCount = (progress || []).filter((p) => p.favorited).length;
    const totalCompletions = (progress || []).reduce(
      (sum, p) => sum + (p.times_completed || 0),
      0
    );

    return {
      stats: {
        totalTools,
        completedTools,
        completionRate: totalTools > 0 ? Math.round((completedTools / totalTools) * 100) : 0,
        favoriteCount,
        totalCompletions,
      },
      error: null,
    };
  },
};

export default toolService;
