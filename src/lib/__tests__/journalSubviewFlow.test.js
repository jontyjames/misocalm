import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const journalPage = readFileSync(join(process.cwd(), 'app/(app)/journal/page.jsx'), 'utf8');

describe('journal subview route flow', () => {
  it('uses a deterministic in-page return for journal subviews', () => {
    expect(journalPage).toContain('const returnToHub = () => {');
    expect(journalPage).toContain("setView('hub')");
    expect(journalPage).toContain("window.history.replaceState({ view: 'hub' }, '', '/journal')");
    expect(journalPage).toContain('onClick={returnToHub}');
    expect(journalPage).not.toContain('window.history.back()');
  });

  it('keeps browser back and swipe gestures synced through popstate', () => {
    expect(journalPage).toContain("window.addEventListener('popstate', handlePopState)");
    expect(journalPage).toContain("window.history.pushState({ view: newView }, '', '/journal')");
  });
});
