import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const triggerPage = readFileSync(join(process.cwd(), 'app/(app)/profile/triggers/page.jsx'), 'utf8');

describe('profile trigger route flow', () => {
  it('returns to profile deterministically after saving triggers', () => {
    expect(triggerPage).toContain('setTimeout(() => router.push(ROUTES.PROFILE), 1597)');
    expect(triggerPage).not.toContain('router.back()');
  });

  it('keeps trigger saving status calm and screen-reader polite', () => {
    expect(triggerPage).toContain('Saving gently...');
    expect(triggerPage).toContain('aria-live="polite"');
    expect(triggerPage).not.toContain('Saving...');
  });
});
