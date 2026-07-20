import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(join(process.cwd(), 'src', 'components', 'composed', 'journal', 'JournalHistoryList.jsx'), 'utf8');

describe('JournalHistoryList copy', () => {
  it('uses context-specific pagination loading language', () => {
    expect(source).toContain('Bringing entries in...');
    expect(source).not.toContain("loadingMore ? 'Loading...'");
  });
});
