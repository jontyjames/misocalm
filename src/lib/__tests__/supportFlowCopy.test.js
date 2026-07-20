import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const supportPage = readFileSync(join(process.cwd(), 'app/(app)/log/support/page.jsx'), 'utf8');

describe('post-log support flow copy', () => {
  it('keeps support option routes connected to post-log context', () => {
    expect(supportPage).toContain("withRouteContext(option.href, ROUTE_CONTEXT.POST_LOG)");
  });

  it('uses a prime-count mantra set with MisoCalm voice', () => {
    const mantraBlock = supportPage.match(/const mantras = \[([\s\S]*?)\];/)?.[1] || '';
    const mantras = mantraBlock
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('"'));

    expect(mantras).toHaveLength(5);
    expect(mantraBlock).not.toMatch(/\bcope\b/i);
    expect(mantraBlock).toContain('find my way');
  });

  it('uses sanctuary return language instead of casual dismissal', () => {
    expect(supportPage).toContain('Return to sanctuary');
    expect(supportPage).not.toContain("I'm Good For Now");
  });
});
