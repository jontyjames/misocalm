import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function readText(path) {
  return readFileSync(join(root, path), 'utf8');
}

function readJson(path) {
  return JSON.parse(readText(path));
}

describe('app-store mobile runbook', () => {
  it('documents the current Capacitor packaging decision against real config', () => {
    const runbook = readText('APP-STORE-MOBILE-RUNBOOK.md');
    const config = readJson('capacitor.config.json');

    expect(config.webDir).toBe('out');
    expect(config.server).toMatchObject({
      url: 'https://misocalm.app',
      cleartext: false,
    });
    expect(runbook).toContain('secure hosted Capacitor shell');
    expect(runbook).toContain('Web directory: `out`');
    expect(runbook).toContain('Hosted server URL: `https://misocalm.app`');
  });

  it('keeps the mobile launch checklist focused on platform risks', () => {
    const runbook = readText('APP-STORE-MOBILE-RUNBOOK.md');

    [
      'safe areas',
      'Keyboard resize',
      'DPR at 2',
      'Web Audio',
      'Service worker',
      'STRIPE_WEBHOOK_SECRET',
      'Data export and deletion',
      'privacy labels',
      'MisoAI architecture',
    ].forEach((requiredTopic) => {
      expect(runbook).toContain(requiredTopic);
    });
  });

  it('keeps manifest shortcuts aligned with the sanctuary entry points', () => {
    const manifest = readJson('public/manifest.json');
    const shortcutUrls = manifest.shortcuts.map((shortcut) => shortcut.url);

    expect(shortcutUrls).toEqual(expect.arrayContaining([
      '/calm',
      '/tools/regulation',
      '/journal',
    ]));
  });
});
