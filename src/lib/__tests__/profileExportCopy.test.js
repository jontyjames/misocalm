import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const profilePage = readFileSync(
  join(process.cwd(), 'app/(app)/profile/page.jsx'),
  'utf8'
);

describe('profile export loading copy', () => {
  it('uses data-specific export copy with polite status updates', () => {
    expect(profilePage).toContain('Gathering data...');
    expect(profilePage).toContain('aria-live="polite"');
    expect(profilePage).not.toContain("{exporting ? 'Preparing...' : 'JSON'}");
  });
});
