/**
 * useEducationProgress
 * Pure computed helpers from visits object.
 * 3 modules x 3 voices = 9 total explorations.
 */

import { VOICE_KEYS } from '@/lib/educationData';

export function getModuleProgress(visits, slug) {
  const modVisits = visits?.[slug] || {};
  const read = VOICE_KEYS.filter((k) => (modVisits[k] || 0) > 0).length;
  return { read, total: 3, complete: read === 3 };
}

export function getGlobalProgress(visits, allModules) {
  let read = 0;
  for (const mod of allModules) {
    read += getModuleProgress(visits, mod.slug).read;
  }
  return { read, total: 9 };
}

export function getUnreadVoices(visits, slug) {
  const modVisits = visits?.[slug] || {};
  return VOICE_KEYS.filter((k) => (modVisits[k] || 0) === 0);
}

export function getUnfinishedModules(visits, allModules, excludeSlug) {
  return allModules.filter((mod) => {
    if (mod.slug === excludeSlug) return false;
    return getModuleProgress(visits, mod.slug).read < 3;
  });
}
