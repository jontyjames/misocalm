const PANEL_COMPLETES_PRACTICES = new Set([
  'butterfly-tapping',
  'body-scan',
  'progressive-muscle-relaxation',
  'emergency-protocol',
  'movement-reset',
  'cold-water-micro-reset',
  'sound-support',
  'mimicry-bridge',
]);

export function isPanelCompletedPractice(practiceId) {
  return PANEL_COMPLETES_PRACTICES.has(practiceId);
}
