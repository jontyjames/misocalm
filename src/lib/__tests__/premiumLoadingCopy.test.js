import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const premiumPage = readFileSync(join(process.cwd(), 'app/(app)/premium/page.jsx'), 'utf8');

describe('premium loading copy', () => {
  it('uses calm transition language for payment actions', () => {
    expect(premiumPage).toContain('Preparing checkout...');
    expect(premiumPage).toContain('Preparing your portal...');
    expect(premiumPage).toContain('aria-live="polite"');
  });

  it('does not regress to generic opening copy', () => {
    expect(premiumPage).not.toContain('Opening checkout...');
    expect(premiumPage).not.toContain('Opening portal...');
  });
});
