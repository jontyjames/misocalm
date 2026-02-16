/**
 * Chat Service
 * Handles chat message persistence and retrieval
 */

import { db } from './supabase';

export const chatService = {
  /**
   * Get paginated chat messages for a user
   */
  async getAll(userId, options = {}) {
    return db.selectPaginated('chat_messages', {
      ...options,
      filters: { user_id: userId, ...options.filters },
      orderBy: options.orderBy || 'created_at',
      ascending: options.ascending ?? true, // Chat typically shows oldest first
    });
  },

  /**
   * Get recent messages for a user (for chat history)
   */
  async getRecent(userId, limit = 50) {
    // Get the most recent messages, but in chronological order
    const { data, count, pagination, error } = await db.selectPaginated('chat_messages', {
      page: 1,
      limit,
      filters: { user_id: userId },
      orderBy: 'created_at',
      ascending: false, // Get newest first
    });

    // Reverse to show in chronological order
    return {
      data: data ? data.reverse() : null,
      count,
      pagination,
      error,
    };
  },

  /**
   * Save a message to the database
   */
  async saveMessage(userId, role, content) {
    return db.insert('chat_messages', {
      user_id: userId,
      role,
      content,
      created_at: new Date().toISOString(),
    });
  },

  /**
   * Save a user message
   */
  async saveUserMessage(userId, content) {
    return this.saveMessage(userId, 'user', content);
  },

  /**
   * Save an assistant message
   */
  async saveAssistantMessage(userId, content) {
    return this.saveMessage(userId, 'assistant', content);
  },

  /**
   * Save both user and assistant messages as two separate inserts.
   * Note: This is NOT atomic. If the second insert fails, the first
   * message will still be persisted. Acceptable for chat history but
   * callers should be aware of potential partial saves.
   */
  async saveExchange(userId, userMessage, assistantMessage) {
    const userResult = await this.saveUserMessage(userId, userMessage);
    if (userResult.error) {
      return { error: userResult.error };
    }

    const assistantResult = await this.saveAssistantMessage(userId, assistantMessage);
    if (assistantResult.error) {
      return { error: assistantResult.error };
    }

    return {
      data: {
        userMessage: userResult.data?.[0],
        assistantMessage: assistantResult.data?.[0],
      },
      error: null,
    };
  },

  /**
   * Delete all chat history for a user
   */
  async clearHistory(userId) {
    return db.query((supabase) =>
      supabase.from('chat_messages').delete().eq('user_id', userId)
    );
  },

  /**
   * Get message count for a user
   */
  async getMessageCount(userId) {
    const { count, error } = await db.query((supabase) =>
      supabase
        .from('chat_messages')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
    );

    return { count: count || 0, error };
  },

  /**
   * Get messages since a specific date
   */
  async getMessagesSince(userId, sinceDate) {
    const { data, error } = await db.query((supabase) =>
      supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', sinceDate.toISOString())
        .order('created_at', { ascending: true })
    );

    return { data, error };
  },
};

export default chatService;
