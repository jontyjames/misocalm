/**
 * User Trigger Service
 * Manages user's selected triggers and custom triggers
 */

import { db } from './supabase';

export const userTriggerService = {
  /**
   * Get all available triggers for a user (system + their custom)
   */
  async getAvailableTriggers(userId) {
    // Get system triggers (user_id is null) and user's custom triggers
    const { data, error } = await db.query(
      `SELECT * FROM triggers
       WHERE user_id IS NULL OR user_id = '${userId}'
       ORDER BY is_custom ASC, name ASC`
    );

    if (error) return { data: null, error };
    return { data, error: null };
  },

  /**
   * Get user's selected triggers
   */
  async getUserTriggers(userId) {
    const { data, error } = await db.query(
      `SELECT t.* FROM triggers t
       INNER JOIN user_triggers ut ON t.id = ut.trigger_id
       WHERE ut.user_id = '${userId}'
       ORDER BY t.name ASC`
    );

    if (error) return { data: null, error };
    return { data, error: null };
  },

  /**
   * Save user's selected triggers (replaces existing)
   * @param {string} userId - User ID
   * @param {string[]} triggerNames - Array of trigger names
   */
  async saveUserTriggers(userId, triggerNames) {
    try {
      // First, get or create triggers by name
      const triggerIds = [];

      for (const name of triggerNames) {
        // Check if trigger exists (system or user's custom)
        const { data: existing } = await db.query(
          `SELECT id FROM triggers
           WHERE name = '${name.replace(/'/g, "''")}'
           AND (user_id IS NULL OR user_id = '${userId}')`
        );

        if (existing && existing.length > 0) {
          triggerIds.push(existing[0].id);
        } else {
          // Create as custom trigger for this user
          const { data: newTrigger, error: createError } = await db.insert('triggers', {
            name: name,
            is_custom: true,
            user_id: userId,
          });

          if (createError) {
            console.error('Failed to create trigger:', createError);
            continue;
          }
          if (newTrigger && newTrigger[0]) {
            triggerIds.push(newTrigger[0].id);
          }
        }
      }

      // Delete existing user_triggers for this user
      await db.query((supabase) =>
        supabase.from('user_triggers').delete().eq('user_id', userId)
      );

      // Insert new user_triggers
      for (const triggerId of triggerIds) {
        await db.insert('user_triggers', {
          user_id: userId,
          trigger_id: triggerId,
        });
      }

      return { error: null };
    } catch (err) {
      console.error('Failed to save user triggers:', err);
      return { error: err.message };
    }
  },

  /**
   * Add a single custom trigger for a user
   */
  async addCustomTrigger(userId, triggerName) {
    // Check if it already exists
    const { data: existing } = await db.query(
      `SELECT id FROM triggers
       WHERE name = '${triggerName.replace(/'/g, "''")}'
       AND (user_id IS NULL OR user_id = '${userId}')`
    );

    if (existing && existing.length > 0) {
      // Link existing trigger to user in junction table
      await db.query((supabase) =>
        supabase.from('user_triggers').upsert(
          { user_id: userId, trigger_id: existing[0].id },
          { onConflict: 'user_id,trigger_id' }
        )
      );
      return { data: existing[0], error: null };
    }

    // Create new custom trigger
    const { data, error } = await db.insert('triggers', {
      name: triggerName,
      is_custom: true,
      user_id: userId,
    });

    // Link new trigger to user in junction table
    const triggerId = data?.[0]?.id;
    if (triggerId) {
      await db.query((supabase) =>
        supabase.from('user_triggers').upsert(
          { user_id: userId, trigger_id: triggerId },
          { onConflict: 'user_id,trigger_id' }
        )
      );
    }

    return { data: data?.[0], error };
  },
};
