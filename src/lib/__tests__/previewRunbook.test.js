import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const runbook = readFileSync(join(process.cwd(), 'PREVIEW-DEPLOYMENT-RUNBOOK.md'), 'utf8');

describe('preview deployment runbook', () => {
  it('requires local proof before preview deployment', () => {
    [
      'npm.cmd run test:run',
      'npm.cmd run build',
      'git diff --check',
      'git status --short --branch',
      'graphify update .',
    ].forEach((command) => {
      expect(runbook).toContain(command);
    });
  });

  it('keeps deploy approval and secret boundaries explicit', () => {
    expect(runbook).toContain('Do not deploy, push, commit, or expose secrets without explicit user approval');
    expect(runbook).toContain('npx.cmd vercel --yes');
    expect(runbook).toContain('Do not paste `.env.local` values into chat');
  });

  it('guards the regulation preview tester flow and stop conditions', () => {
    [
      'Regulation Toolkit',
      'Go a little deeper',
      'Return to practices',
      'placeholder audio asset',
      'generic stuck loading screen',
      'soundscapes',
      'MisoAI safety boundaries',
    ].forEach((phrase) => {
      expect(runbook).toContain(phrase);
    });
  });
});
