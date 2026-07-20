import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const planPage = readFileSync(
  join(process.cwd(), 'app/(cosmic)/onboarding/plan/page.jsx'),
  'utf8'
);

describe('onboarding plan loading copy', () => {
  it('uses sanctuary-specific saving language with polite status updates', () => {
    expect(planPage).toContain('Opening sanctuary...');
    expect(planPage).toContain('aria-live="polite"');
    expect(planPage).not.toContain("{saving ? 'Preparing...' : 'Enter MisoCalm'}");
  });
});
