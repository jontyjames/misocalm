import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

describe('error recovery copy', () => {
  it('keeps route-level error recovery calm and sanctuary-oriented', () => {
    const pageError = readText('app/error.jsx');

    expect(pageError).toContain('This space needs a moment');
    expect(pageError).toContain('Nothing you shared is lost');
    expect(pageError).toContain('Open again');
    expect(pageError).toContain('Return to sanctuary');
    expect(pageError).not.toContain('Something went wrong');
    expect(pageError).not.toContain('{error.message}');
  });

  it('keeps global error recovery calm without exposing raw error details', () => {
    const globalError = readText('app/global-error.jsx');

    expect(globalError).toContain('Your sanctuary needs a reset');
    expect(globalError).toContain('The app hit a rough edge');
    expect(globalError).toContain('Open again');
    expect(globalError).toContain('Return home');
    expect(globalError).not.toContain('Critical Error');
    expect(globalError).not.toContain('{error.message}');
  });
});
