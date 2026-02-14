/**
 * User Trigger Service
 * Manages user's selected triggers and custom triggers
 */

import { db } from './supabase';
import { isValidTriggerName } from '@/lib/validators';

export const userTriggerService = {
  /**
   * Get all available triggers for a user (system + their custom)
   */
  async getAvailableTriggers(userId) {
    const { data, error } = await db.query((supabase) =>
      supabase
        .from('triggers')
        .select('*')
        .or(`user_id.is.null,user_id.eq.${userId}`)
        .order('is_custom', { ascending: true })
        .order('name', { ascending: true })
    );

    if (error) return { data: null, error };
    return { data, error: null };
  },

  /**
   * Get user's selected triggers
   */
  async getUserTriggers(userId) {
    const { data, error } = await db.query((supabase) =>
      supabase
        .from('triggers')
        .select('*, user_triggers!inner(user_id)')
        .eq('user_triggers.user_id', userId)
        .order('name', { ascending: true })
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
      // Validate input
      if (!Array.isArray(triggerNames)) {
        return { error: 'Trigger names must be an array' };
      }

      // Filter out invalid names
      const validNames = triggerNames.filter(name => {
        const { valid } = isValidTriggerName(name);
        return valid;
      });

      // First, get or create triggers by name
      const triggerIds = [];

      for (const name of validNames) {
        // Check if trigger exists (system or user's custom)
        const { data: existing } = await db.query((supabase) =>
          supabase
            .from('triggers')
            .select('id')
            .eq('name', name)
            .or(`user_id.is.null,user_id.eq.${userId}`)
            .limit(1)
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

      // Batch insert new user_triggers
      if (triggerIds.length > 0) {
        const rows = triggerIds.map((triggerId) => ({
          user_id: userId,
          trigger_id: triggerId,
        }));
        const { error: insertError } = await db.query((supabase) =>
          supabase.from('user_triggers').insert(rows)
        );
        if (insertError) {
          console.error('Failed to insert user_triggers:', insertError);
          return { error: insertError };
        }
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
    const { data: existing } = await db.query((supabase) =>
      supabase
        .from('triggers')
        .select('id')
        .eq('name', triggerName)
        .or(`user_id.is.null,user_id.eq.${userId}`)
        .limit(1)
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

  /**
   * Remove a single trigger from user's selection by trigger ID
   */
  async removeUserTrigger(userId, triggerId) {
    return db.query((supabase) =>
      supabase.from('user_triggers').delete().eq('user_id', userId).eq('trigger_id', triggerId)
    );
  },

  /**
   * Remove a single trigger from user's selection by name
   */
  async removeUserTriggerByName(userId, triggerName) {
    const { data: trigger } = await db.query((supabase) =>
      supabase
        .from('triggers')
        .select('id')
        .eq('name', triggerName)
        .or(`user_id.is.null,user_id.eq.${userId}`)
        .limit(1)
    );
    if (!trigger?.length) return { error: 'Trigger not found' };
    return this.removeUserTrigger(userId, trigger[0].id);
  },
};
