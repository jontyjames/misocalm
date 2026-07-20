import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const plan = readFileSync(join(process.cwd(), 'COMPONENT-SIZE-REFACTOR-PLAN.md'), 'utf8');

describe('component size refactor plan', () => {
  it('prioritizes user-flow splits over abstract rewrites', () => {
    expect(plan).toContain('Split by user flow');
    expect(plan).toContain('Do not combine a visual redesign with a structural split');
  });

  it('tracks the highest-risk oversized UI surfaces', () => {
    [
      'app/debug/AnalyticsDashboard.jsx',
      'app/debug/flow-lab/page.jsx',
      'app/(cosmic)/page.jsx',
      'app/(cosmic)/onboarding/first-practice/page.jsx',
      'LogFormContainer.jsx',
      'DeeperProcessing.jsx',
      'app/(app)/profile/page.jsx',
    ].forEach((file) => {
      expect(plan).toContain(file);
    });
  });

  it('keeps data files separate from urgent UI refactors', () => {
    [
      'educationData.js',
      'constants.js',
      'Large data files should be split only when there is a clear review or ownership benefit',
      'source-of-truth practice data',
    ].forEach((phrase) => {
      expect(plan).toContain(phrase);
    });
  });

  it('requires verification evidence for each refactor slice', () => {
    [
      'Focused tests pass',
      'npm.cmd run test:run',
      'npm.cmd run build',
      'git diff --check',
      'graphify update .',
    ].forEach((phrase) => {
      expect(plan).toContain(phrase);
    });
  });
});
