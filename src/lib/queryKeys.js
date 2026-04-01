/**
 * React Query key factory
 * Centralized keys prevent typo-based cache misses and make invalidation explicit.
 * Prefix matching: invalidateQueries({ queryKey: ['triggerStats'] }) clears all entries.
 */

export const queryKeys = {
  triggerStats: (userId, days) => ['triggerStats', userId, days],
  triggerLogs:  (userId, filters) => ['triggerLogs', userId, filters],
  userTriggers: (userId) => ['userTriggers', userId],
  tools:        (userId) => ['tools', userId],
  tool:         (toolId, userId) => ['tool', toolId, userId],
  toolStats:    (userId) => ['toolStats', userId],
  streak:       (userId) => ['streak', userId],
};
