/**
 * Shared dynamic-import map for mini experience canvases.
 * Must live at module scope (Next.js dynamic() requirement).
 * Used by HeroExperience and ExperienceGrid.
 */

import dynamic from 'next/dynamic';

const CANVAS_MAP = {
  grounding: dynamic(() => import('./MiniGroundingCanvas'), { ssr: false }),
  mandala: dynamic(() => import('./MiniMandalaCanvas'), { ssr: false }),
  pulse: dynamic(() => import('./MiniPulseCanvas'), { ssr: false }),
  impermanence: dynamic(() => import('./MiniSoundCanvas'), { ssr: false }),
  focus: dynamic(() => import('./MiniFocusCanvas'), { ssr: false }),
  alive: dynamic(() => import('./MiniAliveCanvas'), { ssr: false }),
};

export default CANVAS_MAP;
